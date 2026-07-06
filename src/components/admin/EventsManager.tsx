'use client'

import React, { useState, useRef } from 'react'
import { Plus, Search, Calendar, MapPin, Globe, ExternalLink, Trash2, Edit, CheckCircle, XCircle, Upload, Image as ImageIcon, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import { Event } from './types'
import { cn } from '@/lib/utils'
import { resizedStorageImage, fallbackToOriginalImage } from '@/lib/images'
import { useToast } from '@/components/ui/toast'
import { EventDatePrecision, EventStatus, formatEventDate, formatEventDateForInput, normalizeEventDateForStorage, resolveEventStatus } from '@/lib/events'

interface EventsManagerProps {
  events: Event[]
  onRefresh: () => void
}

export default function EventsManager({ events, onRefresh }: EventsManagerProps) {
  const { showToast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Image Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form State
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    date: '',
    location: '',
    short_description: '',
    full_description: '',
    event_type: 'In-Person',
    link: '',
    image_url: '',
    is_active: true,
    event_date_precision: 'day',
    event_status: 'available'
  })

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'coming_soon':
        return { label: 'Coming Soon', className: 'bg-sky-500/10 text-sky-300 border border-sky-500/20', icon: Sparkles }
      case 'sold_out':
        return { label: 'Sold Out', className: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: XCircle }
      case 'deadline_passed':
        return { label: 'Deadline Reached', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: AlertTriangle }
      case 'completed':
        return { label: 'Event Completed', className: 'bg-gray-500/20 text-gray-300 border border-gray-500/30', icon: CheckCircle2 }
      default:
        return { label: 'Available', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: CheckCircle }
    }
  }

  // Lock body scroll when modal is open
  React.useEffect(() => {
    const isModalOpen = isCreateOpen || isEditOpen
    if (isModalOpen) {
      // Force lock immediately
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.height = '100%'
      document.body.style.height = '100%'
      
      return () => {
        document.body.style.overflow = originalOverflow
        document.documentElement.style.overflow = ''
        document.documentElement.style.height = ''
        document.body.style.height = ''
      }
    }
  }, [isCreateOpen, isEditOpen])

  // Filtered Events
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Image Upload Handler
  const handleImageUpload = async (file: File) => {
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image (JPEG, PNG, WEBP, or GIF)', 'error')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error')
      return
    }

    setIsUploading(true)
    
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')
      
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `events/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl
      
      // Update form and preview
      setFormData(prev => ({ ...prev, image_url: publicUrl }))
      setUploadPreview(publicUrl)
      showToast('Image uploaded successfully', 'success')
      
    } catch (err: any) {
      console.error('Upload error:', err)
      showToast(err.message || 'Failed to upload image', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '', date: '', location: '', short_description: '', full_description: '', 
      event_type: 'In-Person', link: '', image_url: '', is_active: true, event_date_precision: 'day', event_status: 'available'
    })
    setUploadPreview(null)
    setEditingEvent(null)
  }

  const openEditModal = (event: Event) => {
    const effectiveStatus = resolveEventStatus(event)
    const datePrecision = event.event_date_precision || 'day'
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date ? formatEventDateForInput(event.date, datePrecision) : '',
      location: event.location,
      short_description: event.short_description || '',
      full_description: event.full_description || '',
      event_type: event.event_type || 'In-Person',
      link: event.link || '',
      image_url: event.image_url || '',
      is_active: event.is_active,
      event_date_precision: datePrecision,
      event_status: effectiveStatus
    })
    setUploadPreview(event.image_url || null)
    setIsEditOpen(true)
  }

  const handleFormSubmit = async (asDraft: boolean) => {
    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')

      const selectedStatus = (formData.event_status || 'available') as EventStatus
      const selectedDatePrecision = (formData.event_date_precision || 'day') as EventDatePrecision
      const normalizedDate = normalizeEventDateForStorage(formData.date, selectedDatePrecision)
      
      // Prepare update/insert data - only include valid fields
      // Note: We always save the link even if status is not 'available' — the
      // frontend hides it when appropriate, so admin can re-enable later.
      const eventData = {
        title: formData.title,
        date: formData.date && formData.date.trim() ? normalizedDate : null,
        location: formData.location,
        short_description: formData.short_description,
        full_description: formData.full_description || null,
        event_type: formData.event_type,
        link: formData.link || null,
        image_url: formData.image_url || null,
        // Drafts are hidden from the public; published events respect the is_active toggle
        is_active: asDraft ? false : (formData.is_active ?? true),
        is_published: !asDraft,
        event_date_precision: selectedDatePrecision,
        event_status: selectedStatus,
        is_sold_out: selectedStatus === 'sold_out',
        description: formData.short_description // Legacy fallback
      }

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id)
        
        if (error) {
          console.error('Update error:', error)
          throw error
        }
        showToast(asDraft ? 'Draft saved — not visible on the website' : 'Event updated successfully', asDraft ? 'info' : 'success')
        setIsEditOpen(false)
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([eventData])
        
        if (error) {
          console.error('Create error:', error)
          throw error
        }
        showToast(asDraft ? 'Draft saved — not visible on the website' : 'Event created and published', asDraft ? 'info' : 'success')
        setIsCreateOpen(false)
      }
      
      resetForm()
      onRefresh()
    } catch (err: any) {
      console.error('Form submission error:', err)
      showToast(editingEvent ? `Failed to update event: ${err.message}` : `Failed to create event: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleFormSubmit(false)
  }

  const handleSaveDraft = async () => {
    await handleFormSubmit(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return
    
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')
      
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      showToast('Event deleted', 'success')
      onRefresh()
    } catch (err) {
      showToast('Failed to delete event', 'error')
    }
  }

  const toggleStatus = async (event: Event) => {
     try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')
      
      const { error } = await supabase
        .from('events')
        .update({ is_active: !event.is_active })
        .eq('id', event.id)
      
      if (error) throw error
      onRefresh()
    } catch (err) {
      showToast('Failed to update status', 'error')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#062419] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#0EA56B] to-[#0A3D2E] hover:from-[#0EA56B]/90 hover:to-[#0A3D2E]/90 text-white font-bold rounded-xl shadow-lg shadow-[#0EA56B]/20 flex items-center justify-center gap-2 transition-all border border-[#D4AF37]/20"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.length === 0 ? (
           <div className="text-center py-20 bg-forest-green/50 border border-white/10 rounded-2xl">
              <Calendar className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h3 className="text-white/60 font-medium">No events found</h3>
              <p className="text-white/30 text-sm mt-1">Try adjusting your search or create a new one.</p>
           </div>
        ) : (
          filteredEvents.map(event => (
            (() => {
              const status = resolveEventStatus(event)
              const statusBadge = getStatusBadge(status)
              return (
            <div key={event.id} className="group bg-forest-green/50 hover:bg-forest-green border border-white/10 hover:border-gold/30 rounded-xl p-5 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              {/* Event Image Thumbnail */}
              {event.image_url ? (
                <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#D4AF37]/30 transition-colors shadow-lg">
                  <img
                    src={resizedStorageImage(event.image_url, 200)}
                    alt={event.title}
                    onError={fallbackToOriginalImage}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/30 transition-colors">
                  <ImageIcon className="w-8 h-8 text-white/20" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 space-y-3">
                 <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/50 mt-1.5">
                      <span className="flex items-center gap-1.5">
                        {event.event_type === 'Virtual' ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                        {event.location}
                      </span>
                      {event.date && (
                        <>
                          <span className="text-white/20">•</span>
                          <span className="text-xs font-mono text-white/40">
                            {formatEventDate(event.date, event.event_date_precision, { includeTime: true })}
                          </span>
                        </>
                      )}
                    </div>
                 </div>
                 {event.short_description && (
                   <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                     {event.short_description}
                   </p>
                 )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0 mt-2 md:mt-0">
                 {event.is_published === false ? (
                   <span className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                     <Edit className="w-3 h-3" />
                     Draft
                   </span>
                 ) : (
                   <button 
                     onClick={() => toggleStatus(event)}
                     className={cn(
                       "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors",
                       event.is_active 
                         ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" 
                         : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                     )}
                   >
                     {event.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                     {event.is_active ? 'Active' : 'Inactive'}
                   </button>
                 )}
                 <span
                   className={cn(
                     'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5',
                     statusBadge.className
                   )}
                 >
                   <statusBadge.icon className="w-3 h-3" />
                   {statusBadge.label}
                 </span>

                 <div className="flex items-center gap-2">
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-[#D4AF37] transition-colors" title="View Event Link">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => openEditModal(event)} className="p-2 hover:bg-[#D4AF37]/10 rounded-lg text-white/50 hover:text-[#D4AF37] transition-colors" title="Edit Event">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400 transition-colors" title="Delete Event">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
              )
            })()
          ))
        )}
      </div>

      {/* Create/Edit Modal (Simple Overlay) */}
      {(isCreateOpen || isEditOpen) && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-start justify-center p-4 md:p-8"
            onClick={(e) => {
              // Only close if clicking directly on the backdrop (not the modal)
              if (e.target === e.currentTarget) {
                setIsCreateOpen(false)
                setIsEditOpen(false)
                resetForm()
              }
            }}
            onWheel={(e) => {
              // Prevent wheel scroll from affecting background
              e.stopPropagation()
            }}
          >
            <div className="relative w-full max-w-2xl bg-[#062419] border border-[#D4AF37]/20 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden my-auto">
              
              {/* Header */}
              <div className="sticky top-0 bg-[#062419]/90 backdrop-blur-md z-20 border-b border-white/10 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#0A3D2E] flex items-center justify-center shadow-lg">
                    {editingEvent ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Event Configuration</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); resetForm() }} 
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                 <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <form onSubmit={handleSubmit} className="p-8 space-y-10">
                
                {/* 1. Basic Information */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-[#D4AF37] mb-2">
                    <div className="w-1 h-4 bg-[#D4AF37] rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">General Information</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase ml-1">Event Title</label>
                        <div className="relative">
                          <input 
                            required
                            placeholder="e.g. Finance Networking Night"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})}
                          />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase ml-1">Date Format</label>
                        <select
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all appearance-none cursor-pointer"
                          value={formData.event_date_precision || 'day'}
                          onChange={e => setFormData({ ...formData, event_date_precision: e.target.value as EventDatePrecision, date: '' })}
                        >
                          <option value="month" className="bg-[#1a1a2e] text-white">Month & Year Only</option>
                          <option value="day" className="bg-[#1a1a2e] text-white">Exact Date Only</option>
                          <option value="time" className="bg-[#1a1a2e] text-white">Exact Date & Time</option>
                        </select>
                        <p className="text-xs text-white/40 ml-1">
                          Pick month-only when the exact day is still to be confirmed.
                        </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        {formData.event_date_precision === 'month'
                          ? 'Month & Year'
                          : formData.event_date_precision === 'time'
                            ? 'Date & Time'
                            : 'Date'} <span className="text-white/30 font-normal">(Optional)</span>
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type={formData.event_date_precision === 'month' ? 'month' : formData.event_date_precision === 'time' ? 'datetime-local' : 'date'}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all [color-scheme:dark]" 
                          value={formData.date || ''}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, date: ''})}
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-red-400 hover:border-red-400/30 transition-colors font-medium text-sm"
                          title="Clear date"
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-xs text-white/40 ml-1">
                        Time is available when needed, but no longer required for every event.
                      </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase ml-1">Event Type</label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all appearance-none cursor-pointer"
                          value={formData.event_type}
                          onChange={e => setFormData({...formData, event_type: e.target.value as any})}
                        >
                          <option value="In-Person" className="bg-[#1a1a2e] text-white">In-Person Event</option>
                          <option value="Virtual" className="bg-[#1a1a2e] text-white">Virtual / Online</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase ml-1">Location / URL</label>
                        <div className="relative">
                          <input 
                            required
                            placeholder={formData.event_type === 'Virtual' ? 'Join Link or Room Name' : 'Venue Name, City'}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                            value={formData.location} 
                            onChange={e => setFormData({...formData, location: e.target.value})}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                            {formData.event_type === 'Virtual' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          </div>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Event Status</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all appearance-none cursor-pointer"
                      value={formData.event_status || 'available'}
                      onChange={e => setFormData({ ...formData, event_status: e.target.value as EventStatus })}
                    >
                      <option value="available" className="bg-[#1a1a2e] text-white">Available — show registration links</option>
                      <option value="coming_soon" className="bg-[#1a1a2e] text-white">Coming Soon — show the event without opening registration yet</option>
                      <option value="sold_out" className="bg-[#1a1a2e] text-white">Sold Out — no spots left</option>
                      <option value="deadline_passed" className="bg-[#1a1a2e] text-white">Deadline Reached — registration/application closed</option>
                      <option value="completed" className="bg-[#1a1a2e] text-white">Event Completed — event has finished</option>
                    </select>
                    <p className="text-xs text-white/40 ml-1">
                      Any status other than &quot;Available&quot; will hide registration links and show a status badge on the website.
                    </p>
                  </div>
                </section>

                {/* 2. Content Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-[#D4AF37] mb-2">
                    <div className="w-1 h-4 bg-[#D4AF37] rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Content & Details</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Short Preview Description</label>
                    <input 
                      required
                      placeholder="Catchy one-liner for the card preview"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all" 
                      value={formData.short_description} 
                      onChange={e => setFormData({...formData, short_description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Full Event Description</label>
                    <textarea 
                      placeholder="Describe what attendees can expect..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:border-[#D4AF37] outline-none min-h-[160px] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all resize-none" 
                      value={formData.full_description || ''} 
                      onChange={e => setFormData({...formData, full_description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">Registration Link (External)</label>
                      <div className="relative">
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all" 
                          value={formData.link || ''} 
                          onChange={e => setFormData({...formData, link: e.target.value})}
                          placeholder="https://eventbrite.com/..."
                        />
                        <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                      </div>
                  </div>
                </section>

                {/* 3. Media Section */}
                <section className="space-y-6">
                   <div className="flex items-center gap-2 text-[#D4AF37] mb-2">
                    <div className="w-1 h-4 bg-[#D4AF37] rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Event Media</h3>
                  </div>

                   <div className="space-y-4">
                     <label className="text-xs font-bold text-white/50 uppercase ml-1">Poster / Header Image</label>
                     <input 
                       type="file" 
                       ref={fileInputRef}
                       accept="image/jpeg,image/png,image/webp,image/gif"
                       onChange={handleFileChange}
                       className="hidden"
                     />
                     
                     <div
                       onDrop={handleDrop}
                       onDragOver={(e) => e.preventDefault()}
                       onClick={() => fileInputRef.current?.click()}
                       className={cn(
                         "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all overflow-hidden",
                         uploadPreview || formData.image_url 
                           ? "border-[#D4AF37]/50 bg-[#D4AF37]/5" 
                           : "border-white/10 bg-white/5 hover:border-[#D4AF37]/30 hover:bg-white/10"
                       )}
                     >
                       {isUploading ? (
                         <div className="flex flex-col items-center gap-3 py-6">
                           <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
                           <span className="text-white/60 font-medium">Uploading visual...</span>
                         </div>
                       ) : uploadPreview || formData.image_url ? (
                         <div className="relative group/img">
                           <img 
                             src={uploadPreview || formData.image_url || ''} 
                             alt="Event preview" 
                             className="max-h-96 w-full mx-auto rounded-xl shadow-2xl transition-transform group-hover/img:scale-[1.02] duration-500 object-contain bg-white/5 p-4"
                           />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                              <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-xl">Change Image</span>
                           </div>
                           <button 
                             type="button"
                             onClick={(e) => {
                               e.stopPropagation()
                               setUploadPreview(null)
                               setFormData(prev => ({ ...prev, image_url: '' }))
                             }}
                             className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full text-white shadow-xl hover:bg-red-600 transition-colors z-10"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center gap-4 py-6">
                           <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                             <Upload className="w-8 h-8 text-[#D4AF37]" />
                           </div>
                           <div>
                             <p className="text-white font-bold text-lg leading-none">Upload Cover Image</p>
                             <p className="text-white/30 text-sm mt-2">Drag and drop or click to browse</p>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                             PNG • JPG • WEBP (MAX 5MB)
                           </div>
                         </div>
                       )}
                     </div>
                     
                     <div className="relative flex items-center">
                       <div className="flex-1 border-t border-white/10"></div>
                       <span className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Or use direct image URL</span>
                       <div className="flex-1 border-t border-white/10"></div>
                     </div>

                     <input 
                       className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#D4AF37] outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all text-sm" 
                       value={formData.image_url || ''} 
                       onChange={e => {
                         setFormData({...formData, image_url: e.target.value})
                         setUploadPreview(null)
                       }}
                       placeholder="https://images.unsplash.com/..."
                     />
                   </div>
                </section>

                {/* Submit Actions - INSIDE FORM */}
                <div className="sticky bottom-0 bg-[#062419]/90 backdrop-blur-md z-20 -m-8 mb-0 mt-6 p-8 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                   <button 
                     type="button" 
                     onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); resetForm() }}
                     className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                   >
                     Discard
                   </button>
                   <button 
                     type="button"
                     onClick={handleSaveDraft}
                     disabled={loading || isUploading}
                     className="w-full sm:flex-1 px-5 py-3.5 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {loading ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                     ) : (
                       <Edit className="w-4 h-4" />
                     )}
                     Save Draft
                   </button>
                   <button 
                     type="submit" 
                     disabled={loading || isUploading}
                     className="w-full sm:flex-1 btn-gradient gold text-sm py-3.5 px-5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 group"
                   >
                     {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {editingEvent ? 'Updating...' : 'Processing...'}
                        </>
                     ) : (
                        <>
                          {editingEvent
                            ? (editingEvent.is_published === false ? 'Publish Event' : 'Save Changes')
                            : 'Confirm & Launch Event'
                          }
                          {editingEvent
                            ? (editingEvent.is_published === false ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />)
                            : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                          }
                        </>
                     )}
                   </button>
                </div>

              </form>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
