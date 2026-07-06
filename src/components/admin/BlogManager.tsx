'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Plus, Search, FileText, Trash2, Edit, Upload, Image as ImageIcon,
  Loader2, Eye, EyeOff, Tag, User, Calendar, Globe, ChevronDown, X,
  Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon, Heading2,
  Heading3, Undo, Redo, AlignLeft, Strikethrough, Code2, FileCode, MonitorPlay
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { getSupabaseClient } from '@/lib/supabase'
import { BlogPost } from './types'
import { cn } from '@/lib/utils'
import { resizedStorageImage, fallbackToOriginalImage } from '@/lib/images'
import { useToast } from '@/components/ui/toast'

interface BlogManagerProps {
  posts: BlogPost[]
  onRefresh: () => void
}

const CATEGORIES = ['General', 'Newsletter', 'Finance', 'Law', 'Engineering', 'Careers', 'Events', 'Community', 'Insights']

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getExcerpt(html: string, maxLength = 180): string {
  const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, '')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// Rich Text Editor Toolbar - Provides formatting controls for content editing
function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null

  const setLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
  }

  const buttons = [
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Heading 3' },
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), title: 'Strikethrough' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Quote' },
    { icon: LinkIcon, action: setLink, active: editor.isActive('link'), title: 'Link' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#041C12] border-b border-white/10 rounded-t-xl">
      {/* History */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Format Buttons */}
      {buttons.map((btn) => (
        <button
          key={btn.title}
          type="button"
          onClick={btn.action}
          title={btn.title}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            btn.active
              ? "bg-gold/20 text-gold border border-gold/30"
              : "text-white/50 hover:text-white hover:bg-white/10"
          )}
        >
          <btn.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BlogManager({ posts, onRefresh }: BlogManagerProps) {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // HTML upload mode
  const [contentMode, setContentMode] = useState<'editor' | 'html'>('editor')
  const [htmlCode, setHtmlCode] = useState('')
  const [showHtmlPreview, setShowHtmlPreview] = useState(false)
  const htmlFileInputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)
  const categoryInputRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    cover_image_url: '',
    category: 'General',
    author_name: 'LEAF Pathways',
    is_published: false,
  })

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your newsletter / blog post here…' }),
    ],
    editorProps: {
      attributes: {
        class: 'blog-tiptap-editor min-h-[320px] px-5 py-4 text-white/80 focus:outline-none leading-relaxed text-sm',
      },
    },
  })

  // Scroll lock when modal is open — use CSS class so it wins over
  // the !important mobile-scroll-fix rules in globals.css
  React.useEffect(() => {
    if (isModalOpen) {
      document.documentElement.classList.add('modal-open')
      return () => {
        document.documentElement.classList.remove('modal-open')
      }
    }
  }, [isModalOpen])

  const resetForm = useCallback(() => {
    setFormData({ title: '', slug: '', excerpt: '', cover_image_url: '', category: 'General', author_name: 'LEAF Pathways', is_published: false })
    editor?.commands.clearContent()
    setEditingPost(null)
    setContentMode('editor')
    setHtmlCode('')
    setShowHtmlPreview(false)
  }, [editor])

  const openCreate = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      cover_image_url: post.cover_image_url || '',
      category: post.category,
      author_name: post.author_name,
      is_published: post.is_published,
    })
    // Detect if content is full HTML (has <!DOCTYPE or <html or <style tags at root level)
    const content = post.content || ''
    const isFullHtml = /<!DOCTYPE|<html[\s>]|<style[\s>]/i.test(content)
    if (isFullHtml) {
      setContentMode('html')
      setHtmlCode(content)
      setShowHtmlPreview(true)
    } else {
      setContentMode('editor')
      setHtmlCode('')
      setShowHtmlPreview(false)
      editor?.commands.setContent(content)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: editingPost ? prev.slug : slugify(value),
    }))
  }

  // Cover image upload
  const handleImageUpload = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!validTypes.includes(file.type)) { showToast('Please upload a valid image (JPEG, PNG, WEBP, GIF)', 'error'); return }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be less than 5MB', 'error'); return }

    setIsUploading(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')
      const ext = file.name.split('.').pop()
      const filePath = `blog/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('blog-images').upload(filePath, file, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr
      const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(filePath)
      setFormData(prev => ({ ...prev, cover_image_url: urlData.publicUrl }))
      showToast('Cover image uploaded', 'success')
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title?.trim()) { showToast('Title is required', 'error'); return }
    if (!formData.slug?.trim()) { showToast('Slug is required', 'error'); return }

    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')

      const htmlContent = contentMode === 'html' ? htmlCode : (editor?.getHTML() || '')
      const autoExcerpt = formData.excerpt?.trim() || getExcerpt(htmlContent)

      const payload = {
        title: formData.title!.trim(),
        slug: formData.slug!.trim(),
        content: htmlContent,
        excerpt: autoExcerpt,
        cover_image_url: formData.cover_image_url || null,
        category: formData.category || 'General',
        author_name: formData.author_name?.trim() || 'LEAF Pathways',
        is_published: formData.is_published ?? false,
        published_at: formData.is_published ? (editingPost?.published_at || new Date().toISOString()) : null,
      }

      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id)
        if (error) throw error
        showToast('Post updated successfully', 'success')
      } else {
        const { error } = await supabase.from('blog_posts').insert([payload])
        if (error) throw error
        showToast('Post created successfully', 'success')
      }

      closeModal()
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Failed to save post', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      showToast('Post deleted', 'success')
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Failed to delete post', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')

      const nextPublished = !post.is_published
      const payload = {
        is_published: nextPublished,
        published_at: nextPublished ? (post.published_at || new Date().toISOString()) : null,
      }

      const { error } = await supabase.from('blog_posts').update(payload).eq('id', post.id)
      if (error) throw error

      showToast(nextPublished ? 'Post published' : 'Post unpublished', 'success')
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Failed to update publish status', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Filtered list
  const allCategories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))]
  const filtered = posts
    .filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter
      return matchSearch && matchCat
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return iso }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search posts…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#062419] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </div>
          {/* Category filter */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#062419] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-sm text-white focus:outline-none focus:border-gold/50 appearance-none cursor-pointer"
            >
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-gold via-amber-500 to-gold text-[#020B09] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Posts', value: posts.length },
          { label: 'Published', value: posts.filter(p => p.is_published).length },
          { label: 'Drafts', value: posts.filter(p => !p.is_published).length },
        ].map((s) => (
          <div key={s.label} className="bg-forest-green/40 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-gold">{s.value}</div>
            <div className="text-white/50 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Posts List ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-forest-green/40 border border-white/10 rounded-2xl p-16 text-center">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg font-medium">No posts found</p>
            <p className="text-white/25 text-sm mt-1">Create your first newsletter post to get started</p>
            <button onClick={openCreate} className="mt-6 px-5 py-2 bg-gold/20 border border-gold/30 rounded-xl text-gold text-sm font-medium hover:bg-gold/30 transition-colors">
              Create Post
            </button>
          </div>
        ) : (
          filtered.map(post => (
            <div
              key={post.id}
              className="group bg-forest-green/40 border border-white/10 hover:border-gold/20 rounded-2xl p-5 flex items-center gap-5 transition-all duration-200 hover:bg-forest-green/60"
            >
              {/* Cover thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#062419] border border-white/10">
                {post.cover_image_url ? (
                  <img src={resizedStorageImage(post.cover_image_url, 200)} alt="" onError={fallbackToOriginalImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white/20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium",
                    post.is_published
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-white/5 text-white/40 border border-white/10"
                  )}>
                    {post.is_published ? <><Eye className="w-3 h-3" /> Published</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold/80 border border-gold/15 font-medium">{post.category}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-gold transition-colors truncate">{post.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author_name}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>
                  {post.content && <span>{estimateReadTime(post.content)} min read</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleTogglePublish(post)}
                  disabled={loading}
                  className={cn(
                    "p-2 rounded-xl text-white/70 transition-all disabled:opacity-50",
                    post.is_published
                      ? "bg-emerald-500/15 hover:bg-emerald-500/25 hover:text-emerald-300"
                      : "bg-white/5 hover:bg-gold/20 hover:text-gold"
                  )}
                  title={post.is_published ? 'Unpublish post' : 'Publish post'}
                >
                  {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold text-white/60 transition-all"
                  title="Edit post"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 transition-all disabled:opacity-50"
                  title="Delete post"
                >
                  {deletingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto overscroll-contain" data-lenis-prevent style={{ WebkitOverflowScrolling: 'touch' }} onWheel={e => e.stopPropagation()}>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal} />

          {/* Modal Panel — no max-height, the outer container scrolls instead */}
          <div className="relative w-full max-w-3xl my-4 mx-4 sm:my-8 bg-[#0A1F16] border border-white/15 rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">{editingPost ? 'Edit Post' : 'New Blog Post'}</h2>
                <p className="text-white/40 text-sm mt-0.5">{editingPost ? 'Update your newsletter post' : 'Create a new newsletter / blog post'}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. February Newsletter — Finance & Law Insights"
                  className="w-full bg-[#062419] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 text-sm"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">URL Slug <span className="text-red-400">*</span></label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <span className="text-white/30 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                    placeholder="my-post-slug"
                    className="flex-1 bg-[#062419] border border-white/10 rounded-xl px-4 py-2.5 text-white/80 placeholder-white/25 focus:outline-none focus:border-gold/50 text-sm"
                  />
                </div>
              </div>

              {/* Author + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Author</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={formData.author_name || ''}
                      onChange={e => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                      placeholder="LEAF Pathways"
                      className="w-full bg-[#062419] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Category</label>
                  <div className="relative" ref={categoryInputRef}>
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, category: e.target.value }))
                        setShowCategorySuggestions(true)
                      }}
                      onFocus={() => setShowCategorySuggestions(true)}
                      onBlur={() => { setTimeout(() => setShowCategorySuggestions(false), 150) }}
                      placeholder="Type or select a category"
                      className="w-full bg-[#062419] border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 text-sm"
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                    />
                    {/* Suggestion dropdown */}
                    {showCategorySuggestions && (() => {
                      const existingFromPosts = posts.map(p => p.category).filter(Boolean)
                      const allOptions = Array.from(new Set([...CATEGORIES, ...existingFromPosts]))
                      const query = (formData.category || '').toLowerCase()
                      const filtered = query
                        ? allOptions.filter(c => c.toLowerCase().includes(query))
                        : allOptions
                      if (filtered.length === 0) return null
                      // Don't show if only exact match
                      if (filtered.length === 1 && filtered[0].toLowerCase() === query) return null
                      return (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#0A1F16] border border-white/15 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          {filtered.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onMouseDown={e => {
                                e.preventDefault()
                                setFormData(prev => ({ ...prev, category: cat }))
                                setShowCategorySuggestions(false)
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 text-sm transition-colors",
                                (formData.category || '').toLowerCase() === cat.toLowerCase()
                                  ? "bg-gold/15 text-gold"
                                  : "text-white/70 hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Cover Image</label>
                {formData.cover_image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#062419]">
                    <img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white/90 text-black rounded-lg text-xs font-medium">Change</button>
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, cover_image_url: '' }))} className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleImageUpload(f) }}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-gold/30 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-7 h-7 text-gold animate-spin" />
                        <span className="text-white/50 text-sm">Uploading…</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-gold/10 flex items-center justify-center transition-colors">
                          <Upload className="w-5 h-5 text-white/40 group-hover:text-gold transition-colors" />
                        </div>
                        <span className="text-white/50 text-sm">Drag & drop or <span className="text-gold">click to upload</span></span>
                        <span className="text-white/25 text-xs">JPEG, PNG, WEBP up to 5MB</span>
                      </div>
                    )}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Excerpt <span className="text-white/30 font-normal">(optional — auto-generated if blank)</span>
                </label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short summary shown on the blog listing page…"
                  rows={2}
                  className="w-full bg-[#062419] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 text-sm resize-none"
                />
              </div>

              {/* ── Content Mode Tabs ── */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Content <span className="text-red-400">*</span></label>

                {/* Tab bar */}
                <div className="flex items-center gap-1 p-1 bg-[#041C12] rounded-xl mb-3 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setContentMode('editor')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                      contentMode === 'editor'
                        ? "bg-gold/20 text-gold border border-gold/30 shadow-sm"
                        : "text-white/50 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    <Edit className="w-4 h-4" />
                    Rich Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentMode('html')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                      contentMode === 'html'
                        ? "bg-gold/20 text-gold border border-gold/30 shadow-sm"
                        : "text-white/50 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    <Code2 className="w-4 h-4" />
                    HTML Code
                  </button>
                </div>

                {/* Rich Text Editor */}
                {contentMode === 'editor' && (
                  <div>
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-[#062419] focus-within:border-gold/30 transition-colors">
                      <EditorToolbar editor={editor} />
                      <EditorContent editor={editor} />
                    </div>
                    {/* Rich-text preview toggle */}
                    <button
                      type="button"
                      onClick={() => setShowHtmlPreview(prev => !prev)}
                      className="mt-2 flex items-center gap-1.5 text-xs text-white/40 hover:text-gold transition-colors"
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      {showHtmlPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    {showHtmlPreview && (
                      <div className="mt-2 border border-white/10 rounded-xl overflow-hidden bg-white">
                        <iframe
                          ref={iframeRef}
                          srcDoc={`<!DOCTYPE html><html><head><style>body{font-family:Inter,sans-serif;padding:16px;font-size:14px;color:#1a1a1a;line-height:1.7;}</style></head><body>${editor?.getHTML() || ''}</body></html>`}
                          className="w-full min-h-[200px] border-0"
                          sandbox="allow-same-origin"
                          title="Rich text preview"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* HTML Code Mode */}
                {contentMode === 'html' && (
                  <div className="space-y-3">
                    {/* HTML file drop zone */}
                    <div
                      onDrop={e => {
                        e.preventDefault()
                        const file = e.dataTransfer.files?.[0]
                        if (file && (file.name.endsWith('.html') || file.name.endsWith('.htm') || file.type === 'text/html')) {
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            const text = ev.target?.result as string
                            if (text) {
                              setHtmlCode(text)
                              setShowHtmlPreview(true)
                              showToast('HTML file loaded', 'success')
                            }
                          }
                          reader.readAsText(file)
                        } else {
                          showToast('Please drop an HTML file (.html or .htm)', 'error')
                        }
                      }}
                      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
                      onClick={() => htmlFileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/15 hover:border-gold/30 rounded-xl p-6 text-center cursor-pointer transition-colors group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-11 h-11 rounded-2xl bg-white/5 group-hover:bg-gold/10 flex items-center justify-center transition-colors">
                          <FileCode className="w-5 h-5 text-white/40 group-hover:text-gold transition-colors" />
                        </div>
                        <span className="text-white/50 text-sm">
                          Drag & drop an HTML file or <span className="text-gold">click to browse</span>
                        </span>
                        <span className="text-white/25 text-xs">.html or .htm files — like newsletters, email templates, etc.</span>
                      </div>
                    </div>
                    <input
                      ref={htmlFileInputRef}
                      type="file"
                      accept=".html,.htm,text/html"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            const text = ev.target?.result as string
                            if (text) {
                              setHtmlCode(text)
                              setShowHtmlPreview(true)
                              showToast('HTML file loaded', 'success')
                            }
                          }
                          reader.readAsText(file)
                        }
                      }}
                    />

                    {/* Or paste HTML code manually */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-white/40">Or paste HTML code below</span>
                        {htmlCode && (
                          <span className="text-xs text-white/30">{htmlCode.length.toLocaleString()} chars</span>
                        )}
                      </div>
                      <textarea
                        value={htmlCode}
                        onChange={e => setHtmlCode(e.target.value)}
                        placeholder="<html>&#10;  <head>...</head>&#10;  <body>...</body>&#10;</html>"
                        rows={10}
                        spellCheck={false}
                        className="w-full bg-[#041C12] border border-white/10 rounded-xl px-4 py-3 text-green-300/80 placeholder-white/20 focus:outline-none focus:border-gold/50 text-sm resize-y font-mono leading-relaxed"
                      />
                    </div>

                    {/* HTML preview toggle */}
                    <button
                      type="button"
                      onClick={() => setShowHtmlPreview(prev => !prev)}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-gold transition-colors"
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      {showHtmlPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    {showHtmlPreview && htmlCode && (
                      <div className="border border-white/10 rounded-xl overflow-hidden bg-white">
                        <div className="bg-[#041C12] px-3 py-1.5 flex items-center justify-between border-b border-white/10">
                          <span className="text-xs text-white/40 flex items-center gap-1.5"><MonitorPlay className="w-3.5 h-3.5" /> Live Preview</span>
                        </div>
                        <iframe
                          ref={iframeRef}
                          srcDoc={htmlCode}
                          className="w-full min-h-[400px] border-0"
                          sandbox="allow-same-origin"
                          title="HTML preview"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between bg-[#062419] border border-white/10 rounded-xl px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-white">Publish Post</p>
                  <p className="text-xs text-white/40 mt-0.5">Makes the post visible to all visitors at /blog</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
                    formData.is_published ? "bg-emerald-500" : "bg-white/15"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300",
                    formData.is_published ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-500 to-gold text-[#020B09] font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Saving…' : editingPost ? 'Save Changes' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
