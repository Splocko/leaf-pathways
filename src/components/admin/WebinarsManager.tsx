'use client'

import React, { useState } from 'react'
import { Plus, Search, Trash2, Edit, Loader2, Eye, EyeOff, Video, X, Calendar, Clock, User } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import { Webinar } from './types'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

interface WebinarsManagerProps {
  webinars: Webinar[]
  onRefresh: () => void
}

const TOPICS = ['General', 'Finance', 'Law', 'Engineering', 'Accounting', 'Careers', 'Leadership', 'Technology']

const EMPTY_FORM = {
  title: '',
  description: '',
  speaker_name: '',
  speaker_title: '',
  video_url: '',
  thumbnail_url: '',
  duration_minutes: '',
  topic: 'General',
  webinar_date: '',
  is_published: false,
}

function formatDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return iso }
}

export default function WebinarsManager({ webinars, onRefresh }: WebinarsManagerProps) {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Webinar | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [topicFilter, setTopicFilter] = useState('All')

  const filtered = webinars.filter(w => {
    const matchSearch = !search || w.title.toLowerCase().includes(search.toLowerCase()) || (w.speaker_name || '').toLowerCase().includes(search.toLowerCase())
    const matchTopic = topicFilter === 'All' || w.topic === topicFilter
    return matchSearch && matchTopic
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setShowForm(true)
  }

  const openEdit = (w: Webinar) => {
    setEditing(w)
    setForm({
      title: w.title,
      description: w.description || '',
      speaker_name: w.speaker_name || '',
      speaker_title: w.speaker_title || '',
      video_url: w.video_url || '',
      thumbnail_url: w.thumbnail_url || '',
      duration_minutes: w.duration_minutes?.toString() || '',
      topic: w.topic || 'General',
      webinar_date: w.webinar_date ? w.webinar_date.slice(0, 16) : '',
      is_published: w.is_published,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleSave = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return }
    setSaving(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('No DB connection')

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        speaker_name: form.speaker_name.trim() || null,
        speaker_title: form.speaker_title.trim() || null,
        video_url: form.video_url.trim() || null,
        thumbnail_url: form.thumbnail_url.trim() || null,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        topic: form.topic || null,
        webinar_date: form.webinar_date || null,
        is_published: form.is_published,
      }

      if (editing) {
        const { error } = await supabase.from('webinars').update(payload).eq('id', editing.id)
        if (error) throw error
        showToast('Webinar updated', 'success')
      } else {
        const { error } = await supabase.from('webinars').insert(payload)
        if (error) throw error
        showToast('Webinar created', 'success')
      }

      closeForm()
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webinar?')) return
    setDeleting(id)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('No DB connection')
      const { error } = await supabase.from('webinars').delete().eq('id', id)
      if (error) throw error
      showToast('Webinar deleted', 'success')
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const togglePublish = async (w: Webinar) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('No DB connection')
      const { error } = await supabase.from('webinars').update({ is_published: !w.is_published }).eq('id', w.id)
      if (error) throw error
      showToast(w.is_published ? 'Unpublished' : 'Published', 'success')
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error')
    }
  }

  const topics = ['All', ...TOPICS]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Webinars</h2>
          <p className="text-white/40 text-sm mt-0.5">{webinars.length} total · {webinars.filter(w => w.is_published).length} published</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-[#020B09] font-semibold rounded-xl hover:bg-yellow-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Webinar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search webinars…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setTopicFilter(t)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                topicFilter === t
                  ? "bg-gold text-[#020B09]"
                  : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No webinars found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(w => (
            <div
              key={w.id}
              className="flex items-center gap-4 p-4 bg-white/3 border border-white/8 rounded-2xl hover:border-white/15 transition-all group"
            >
              {/* Thumbnail */}
              <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#0A3D2E]/60 flex items-center justify-center">
                {w.thumbnail_url ? (
                  <img src={w.thumbnail_url} alt={w.title} className="w-full h-full object-cover" />
                ) : (
                  <Video className="w-6 h-6 text-gold/40" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-semibold text-sm truncate">{w.title}</h3>
                  {w.topic && (
                    <span className="px-2 py-0.5 rounded-md bg-gold/10 text-gold text-xs border border-gold/20 flex-shrink-0">{w.topic}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                  {w.speaker_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{w.speaker_name}</span>}
                  {w.webinar_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(w.webinar_date)}</span>}
                  {w.duration_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration_minutes} min</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", w.is_published ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/40")}>
                  {w.is_published ? 'Live' : 'Draft'}
                </span>
                <button onClick={() => togglePublish(w)} className="p-2 rounded-lg text-white/40 hover:text-gold hover:bg-white/5 transition-colors" title={w.is_published ? 'Unpublish' : 'Publish'}>
                  {w.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(w)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(w.id)} disabled={deleting === w.id} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                  {deleting === w.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0A1F14] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit Webinar' : 'Add Webinar'}</h3>
              <button onClick={closeForm} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Webinar title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief overview of the webinar"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none"
                />
              </div>

              {/* Speaker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Speaker Name</label>
                  <input
                    type="text"
                    value={form.speaker_name}
                    onChange={e => setForm(f => ({ ...f, speaker_name: e.target.value }))}
                    placeholder="e.g. Jane Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Speaker Title</label>
                  <input
                    type="text"
                    value={form.speaker_title}
                    onChange={e => setForm(f => ({ ...f, speaker_title: e.target.value }))}
                    placeholder="e.g. Partner at Clifford Chance"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
              </div>

              {/* Video URL + Thumbnail */}
              <div>
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Video URL</label>
                <input
                  type="url"
                  value={form.video_url}
                  onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Thumbnail URL</label>
                <input
                  type="url"
                  value={form.thumbnail_url}
                  onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Date + Duration + Topic */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Webinar Date</label>
                  <input
                    type="datetime-local"
                    value={form.webinar_date}
                    onChange={e => setForm(f => ({ ...f, webinar_date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Duration (min)</label>
                  <input
                    type="number"
                    value={form.duration_minutes}
                    onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                    placeholder="60"
                    min={1}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5 block">Topic</label>
                <select
                  value={form.topic}
                  onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  className="w-full bg-[#0A1F14] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors"
                >
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Published */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                  className={cn(
                    "w-10 h-6 rounded-full transition-colors relative",
                    form.is_published ? "bg-gold" : "bg-white/10"
                  )}
                >
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow", form.is_published ? "left-5" : "left-1")} />
                </div>
                <span className="text-sm text-white/70">Publish (visible on /webinars)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button onClick={closeForm} className="px-4 py-2 rounded-xl text-white/60 hover:text-white border border-white/10 hover:border-white/20 text-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-gold text-[#020B09] font-semibold rounded-xl hover:bg-yellow-400 disabled:opacity-60 text-sm transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Save Changes' : 'Create Webinar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
