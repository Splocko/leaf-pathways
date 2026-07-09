'use client'

import React, { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabase'
import { useToast } from './ui/toast'

interface CommunityMember {
  full_name: string
  email: string
  age: number
  location: string
  race_ethnicity: string
  year_group: string
  industry: string
  pathway: string
  first_gen_university: boolean | null
  free_school_meals: boolean | null
  care_experience: boolean | null
  postcode_area: string
  referral_source: string
}

interface FormData {
  fullName: string
  email: string
  age: string
  location: string
  locationOther: string
  raceEthnicity: string
  raceEthnicityOther: string
  yearGroup: string
  yearGroupOther: string
  industry: string
  industryOther: string
  pathway: string
  pathwaySecondary: string
  pathwayOther: string
  firstGenUniversity: string
  freeSchoolMeals: string
  careExperience: string
  postcodeArea: string
  referralSource: string
}

interface CommunityFormProps {
  isOpen: boolean
  onClose: () => void
}

const CommunityForm: React.FC<CommunityFormProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    age: '',
    location: '',
    locationOther: '',
    raceEthnicity: '',
    raceEthnicityOther: '',
    yearGroup: '',
    yearGroupOther: '',
    industry: '',
    industryOther: '',
    pathway: '',
    pathwaySecondary: '',
    pathwayOther: '',
    firstGenUniversity: '',
    freeSchoolMeals: '',
    careExperience: '',
    postcodeArea: '',
    referralSource: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showCommunities, setShowCommunities] = useState(false)
  const [whatsappGroupUnlocked, setWhatsappGroupUnlocked] = useState(false)
  const [whatsappGroup2Unlocked, setWhatsappGroup2Unlocked] = useState(true)
  const [whatsappGroup3Unlocked, setWhatsappGroup3Unlocked] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [mode, setMode] = useState<'choice' | 'login' | 'signup'>('choice')
  const [loginEmail, setLoginEmail] = useState('')
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on both html and body
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  // Reset state and fetch WhatsApp status each time modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('choice')
      setLoginEmail('')
      setSubmitted(false)
      setShowCommunities(false)
      fetchWhatsAppGroupStatus()
    }
  }, [isOpen])

  const fetchWhatsAppGroupStatus = async () => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) return
      const { data, error } = await (supabase.from('app_settings') as any)
        .select('whatsapp_group_unlocked, whatsapp_group2_unlocked, whatsapp_group3_unlocked')
        .eq('setting_key', 'global')
        .single()
      if (error) throw error
      setWhatsappGroupUnlocked(data?.whatsapp_group_unlocked || false)
      setWhatsappGroup2Unlocked(data?.whatsapp_group2_unlocked ?? true)
      setWhatsappGroup3Unlocked(data?.whatsapp_group3_unlocked ?? true)
    } catch (error) {
      console.error('Error fetching WhatsApp group status:', error)
      setWhatsappGroupUnlocked(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoginSubmitting(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Client unavailable')
      const { data, error } = await (supabase
        .from('community_members') as any)
        .select('id')
        .eq('email', loginEmail.trim().toLowerCase())
        .maybeSingle()
      if (error) throw error
      if (!data) {
        showToast("No account found — sign up below!", 'error')
        setMode('signup')
        return
      }
      setSubmitted(true)
      setShowCommunities(true)
      showToast("Welcome back! Here are your community links.", 'info')
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsLoginSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Starting form submission...')
      console.log('Form data:', formData)

      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const resolvePathway = () => {
        const primary = formData.pathway?.trim() || ''
        const secondary = formData.pathwaySecondary?.trim() || ''
        const other = formData.pathwayOther?.trim() || ''

        if (primary === 'Other') return other
        if (!primary) return ''
        if (secondary && secondary !== primary) return `${primary} / ${secondary}`
        return primary
      }

      const memberData: CommunityMember = {
        full_name: formData.fullName,
        email: formData.email,
        age: parseInt(formData.age),
        location: formData.location === 'Other' ? formData.locationOther : formData.location,
        race_ethnicity: formData.raceEthnicity === 'Other' ? formData.raceEthnicityOther : formData.raceEthnicity,
        year_group: formData.yearGroup === 'Other' ? formData.yearGroupOther : formData.yearGroup,
        industry: formData.industry === 'Other' ? formData.industryOther : formData.industry,
        pathway: resolvePathway(),
        first_gen_university: formData.firstGenUniversity === 'yes' ? true : formData.firstGenUniversity === 'no' ? false : null,
        free_school_meals: formData.freeSchoolMeals === 'yes' ? true : formData.freeSchoolMeals === 'no' ? false : null,
        care_experience: formData.careExperience === 'yes' ? true : formData.careExperience === 'no' ? false : null,
        postcode_area: formData.postcodeArea,
        referral_source: formData.referralSource,
      }

      console.log('Insert data:', memberData)

      // supabase client in this project isn't strongly typed to the DB schema,
      // cast the insert payload to any to avoid TypeScript "never" errors.
      const { data, error } = await supabase
        .from('community_members')
        .insert([memberData] as any)
        .select()

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        if ((error as any).code === '23505') {
          setSubmitted(true)
          setShowCommunities(true)
          showToast("You're already a LEAF member — here are your community links!", 'info')
          return
        }
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Form submitted successfully!')
      setSubmitted(true)
      setShowCommunities(true)
      showToast('Successfully joined LEAF! Choose your communities below.', 'success')

      // Auto opt-in to newsletter via the newsletter API
      try {
        const nameParts = formData.fullName.trim().split(/\s+/)
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, firstName: nameParts[0] || '' }),
        })
      } catch (nlErr) {
        // Newsletter opt-in is best-effort; don't block the join flow
        console.error('Newsletter auto opt-in failed:', nlErr)
      }
      // Don't auto-close anymore; let user choose a community
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      showToast(`Error: ${errorMessage}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'pathway') {
      setFormData(prev => ({
        ...prev,
        pathway: value,
        pathwaySecondary: value === 'Other' || value === '' ? '' : prev.pathwaySecondary,
        pathwayOther: value === 'Other' ? prev.pathwayOther : '',
      }))
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleJoinCommunity = () => {
    window.open('https://chat.whatsapp.com/DqC8F459qKc9aJQfz1ElIz?mode=wwt', '_blank', 'noopener,noreferrer')
  }

  const handleJoinCommunity1 = () => {
    window.open('https://chat.whatsapp.com/J0XG09wZbsuDRCs5whHluh?mode=wwt', '_blank', 'noopener,noreferrer')
  }

  const handleJoinCommunity3 = () => {
    window.open('https://chat.whatsapp.com/EY2MdzmCft9ImkkYUBhmrF?mode=wwt', '_blank', 'noopener,noreferrer')
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div>
      {/* Backdrop - not scrollable */}
      <div 
        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Modal container - this scrolls */}
      <div 
        className="fixed inset-0 z-[210] overflow-y-auto"
        onClick={onClose}
        data-lenis-prevent
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl bg-[#0F1A15] border border-[#E8B923]/30 rounded-3xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    Join <span className="text-[#E8B923]">LEAF</span>
                  </h2>
                  <p className="text-white/60 text-sm font-medium">Supporting young professionals across the UK 🌿</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitted && showCommunities ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Success message */}
                <div className="text-center py-10 bg-[#E8B923]/5 rounded-2xl border border-[#E8B923]/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F1A15] via-[#E8B923] to-[#0F1A15] opacity-50"></div>
                  <div className="text-6xl mb-4 animate-in zoom-in-75 duration-700">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Network!</h3>
                  <p className="text-white/60 px-4 max-w-md mx-auto">You're registered. Pick a community group below to get started.</p>
                </div>

                {/* Community options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#E8B923] uppercase tracking-wider mb-4 ml-1">Select A WhatsApp Community</h4>
                  
                  {/* Community 1 */}
                  {whatsappGroupUnlocked ? (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#E8B923]/50 transition-all hover:bg-white/10 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white text-lg mb-1 group-hover:text-[#E8B923] transition-colors">LEAF Community 1</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                              Open
                            </span>
                            <span className="text-xs text-white/40">Limited spaces</span>
                          </div>
                        </div>
                        <button
                          onClick={handleJoinCommunity1}
                          className="px-6 py-3 rounded-xl bg-[#E8B923] hover:bg-[#E8B923]/90 text-[#0F1A15] font-bold shadow-lg shadow-[#E8B923]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          Join Group
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 opacity-60 grayscale">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white/70 text-lg mb-1">LEAF Community 1</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
                              Full
                            </span>
                            <span className="text-xs text-white/30">Capacity reached</span>
                          </div>
                        </div>
                        <button disabled className="px-6 py-3 rounded-xl bg-white/10 text-white/30 font-bold cursor-not-allowed border border-white/5">
                          Filled
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Community 2 */}
                  {whatsappGroup2Unlocked ? (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#E8B923]/50 transition-all hover:bg-white/10 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white text-lg mb-1 group-hover:text-[#E8B923] transition-colors">LEAF Community 2</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                              Open
                            </span>
                            <span className="text-xs text-white/40">Limited spaces</span>
                          </div>
                        </div>
                        <button
                          onClick={handleJoinCommunity}
                          className="px-6 py-3 rounded-xl bg-[#E8B923] hover:bg-[#E8B923]/90 text-[#0F1A15] font-bold shadow-lg shadow-[#E8B923]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          Join Group
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 opacity-60 grayscale">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white/70 text-lg mb-1">LEAF Community 2</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
                              Full
                            </span>
                            <span className="text-xs text-white/30">Capacity reached</span>
                          </div>
                        </div>
                        <button disabled className="px-6 py-3 rounded-xl bg-white/10 text-white/30 font-bold cursor-not-allowed border border-white/5">
                          Filled
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Community 3 */}
                  {whatsappGroup3Unlocked ? (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#E8B923]/50 transition-all hover:bg-white/10 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white text-lg mb-1 group-hover:text-[#E8B923] transition-colors">LEAF Community 3</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                              Open
                            </span>
                            <span className="text-xs text-white/40">Limited spaces</span>
                          </div>
                        </div>
                        <button
                          onClick={handleJoinCommunity3}
                          className="px-6 py-3 rounded-xl bg-[#E8B923] hover:bg-[#E8B923]/90 text-[#0F1A15] font-bold shadow-lg shadow-[#E8B923]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          Join Group
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 opacity-60 grayscale">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white/70 text-lg mb-1">LEAF Community 3</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
                              Full
                            </span>
                            <span className="text-xs text-white/30">Capacity reached</span>
                          </div>
                        </div>
                        <button disabled className="px-6 py-3 rounded-xl bg-white/10 text-white/30 font-bold cursor-not-allowed border border-white/5">
                          Filled
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center pt-6 border-t border-white/10">
                  <p className="text-xs text-white/30">
                    Redirecting to external WhatsApp application
                  </p>
                </div>
              </div>
            ) : mode === 'choice' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center py-2">
                  <p className="text-white/50 text-sm">New here or already part of the network?</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setMode('signup')}
                    className="w-full bg-gradient-to-r from-[#3ECF8E] to-[#1F6B4A] hover:from-[#3ECF8E]/90 hover:to-[#1F6B4A]/90 text-white font-bold py-5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 border border-[#E8B923]/20 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Join LEAF
                  </button>
                  <button
                    onClick={() => setMode('login')}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-xl transition-all hover:-translate-y-0.5 border border-white/10 hover:border-[#E8B923]/40 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Already a member? Sign in
                  </button>
                </div>
              </div>
            ) : mode === 'login' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <div>
                  <h3 className="text-lg font-bold text-white">Welcome back</h3>
                  <p className="text-white/50 text-sm mt-1">Enter your registered email to continue.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">Email</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] focus:ring-1 focus:ring-[#E8B923]/20 outline-none transition-all"
                      placeholder="alex@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoginSubmitting}
                    className="w-full bg-gradient-to-r from-[#3ECF8E] to-[#1F6B4A] hover:from-[#3ECF8E]/90 hover:to-[#1F6B4A]/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8B923]/20"
                  >
                    {isLoginSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </span>
                    ) : 'Continue'}
                  </button>
                  <p className="text-center text-white/30 text-xs">
                    Not registered yet?{' '}
                    <button type="button" onClick={() => setMode('signup')} className="text-[#E8B923]/70 hover:text-[#E8B923] transition-colors underline">
                      Sign up here
                    </button>
                  </p>
                </form>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                {/* Personal Info Group */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#E8B923] mb-2">
                    <div className="w-1 h-4 bg-[#E8B923] rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">About You</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Full Name <span className="text-[#E8B923]">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] focus:ring-1 focus:ring-[#E8B923]/20 outline-none transition-all"
                        placeholder="e.g. Alex Smith"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Email <span className="text-[#E8B923]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] focus:ring-1 focus:ring-[#E8B923]/20 outline-none transition-all"
                        placeholder="alex@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Age <span className="text-[#E8B923]">*</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        required
                        min="16"
                        max="35"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] focus:ring-1 focus:ring-[#E8B923]/20 outline-none transition-all"
                        placeholder="16-35"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Location <span className="text-[#E8B923]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0F1A15]">Select City or Town</option>
                          <option value="Birmingham" className="bg-[#0F1A15]">Birmingham</option>
                          <option value="Bradford" className="bg-[#0F1A15]">Bradford</option>
                          <option value="Bristol" className="bg-[#0F1A15]">Bristol</option>
                          <option value="Cambridge" className="bg-[#0F1A15]">Cambridge</option>
                          <option value="Cardiff" className="bg-[#0F1A15]">Cardiff</option>
                          <option value="Coventry" className="bg-[#0F1A15]">Coventry</option>
                          <option value="Derby" className="bg-[#0F1A15]">Derby</option>
                          <option value="Edinburgh" className="bg-[#0F1A15]">Edinburgh</option>
                          <option value="Glasgow" className="bg-[#0F1A15]">Glasgow</option>
                          <option value="Leeds" className="bg-[#0F1A15]">Leeds</option>
                          <option value="Leicester" className="bg-[#0F1A15]">Leicester</option>
                          <option value="Liverpool" className="bg-[#0F1A15]">Liverpool</option>
                          <option value="London" className="bg-[#0F1A15]">London</option>
                          <option value="Manchester" className="bg-[#0F1A15]">Manchester</option>
                          <option value="Milton Keynes" className="bg-[#0F1A15]">Milton Keynes</option>
                          <option value="Newcastle" className="bg-[#0F1A15]">Newcastle</option>
                          <option value="Nottingham" className="bg-[#0F1A15]">Nottingham</option>
                          <option value="Oxford" className="bg-[#0F1A15]">Oxford</option>
                          <option value="Portsmouth" className="bg-[#0F1A15]">Portsmouth</option>
                          <option value="Reading" className="bg-[#0F1A15]">Reading</option>
                          <option value="Sheffield" className="bg-[#0F1A15]">Sheffield</option>
                          <option value="Southampton" className="bg-[#0F1A15]">Southampton</option>
                          <option value="Wolverhampton" className="bg-[#0F1A15]">Wolverhampton</option>
                          <option value="Other" className="bg-[#0F1A15]">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {formData.location === 'Other' && (
                        <input
                          type="text"
                          name="locationOther"
                          required
                          value={formData.locationOther}
                          onChange={handleInputChange}
                          className="w-full mt-2 bg-white/5 border border-[#E8B923]/50 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] outline-none transition-all animate-in fade-in slide-in-from-top-2"
                          placeholder="Enter your city or town..."
                        />
                      )}
                    </div>

                     <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Race/Ethnicity
                      </label>
                      <div className="relative">
                        <select
                          name="raceEthnicity"
                          value={formData.raceEthnicity}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0F1A15]">Select Option</option>
                          <optgroup label="Asian or Asian British" className="bg-[#0F1A15]">
                            <option value="Asian - Indian" className="bg-[#0F1A15]">Asian – Indian</option>
                            <option value="Asian - Pakistani" className="bg-[#0F1A15]">Asian – Pakistani</option>
                            <option value="Asian - Bangladeshi" className="bg-[#0F1A15]">Asian – Bangladeshi</option>
                            <option value="Asian - Chinese" className="bg-[#0F1A15]">Asian – Chinese</option>
                            <option value="Asian - Other" className="bg-[#0F1A15]">Asian – Other</option>
                          </optgroup>
                          <optgroup label="Black, African, Caribbean or Black British" className="bg-[#0F1A15]">
                            <option value="Black - African" className="bg-[#0F1A15]">Black – African</option>
                            <option value="Black - Caribbean" className="bg-[#0F1A15]">Black – Caribbean</option>
                            <option value="Black - Other" className="bg-[#0F1A15]">Black – Other</option>
                          </optgroup>
                          <optgroup label="Mixed or Multiple Ethnic Groups" className="bg-[#0F1A15]">
                            <option value="Mixed - White and Black Caribbean" className="bg-[#0F1A15]">Mixed – White and Black Caribbean</option>
                            <option value="Mixed - White and Black African" className="bg-[#0F1A15]">Mixed – White and Black African</option>
                            <option value="Mixed - White and Asian" className="bg-[#0F1A15]">Mixed – White and Asian</option>
                            <option value="Mixed - Other" className="bg-[#0F1A15]">Mixed – Other</option>
                          </optgroup>
                          <optgroup label="White" className="bg-[#0F1A15]">
                            <option value="White - British" className="bg-[#0F1A15]">White – British</option>
                            <option value="White - Irish" className="bg-[#0F1A15]">White – Irish</option>
                            <option value="White - Other" className="bg-[#0F1A15]">White – Other</option>
                          </optgroup>
                          <optgroup label="Other Ethnic Group" className="bg-[#0F1A15]">
                            <option value="Other - Arab" className="bg-[#0F1A15]">Other – Arab</option>
                            <option value="Other" className="bg-[#0F1A15]">Other (please specify)</option>
                          </optgroup>
                          <option value="Prefer not to say" className="bg-[#0F1A15]">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {formData.raceEthnicity === 'Other' && (
                        <input
                          type="text"
                          name="raceEthnicityOther"
                          required
                          value={formData.raceEthnicityOther}
                          onChange={handleInputChange}
                          className="w-full mt-2 bg-white/5 border border-[#E8B923]/50 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] outline-none transition-all animate-in fade-in slide-in-from-top-2"
                          placeholder="Please specify..."
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Year Group <span className="text-[#E8B923]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="yearGroup"
                          required
                          value={formData.yearGroup}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0F1A15]">Select Option</option>
                          <option value="GCSE" className="bg-[#0F1A15]">GCSE</option>
                          <option value="A-Level" className="bg-[#0F1A15]">A-Level</option>
                          <option value="University" className="bg-[#0F1A15]">University</option>
                          <option value="Apprentice" className="bg-[#0F1A15]">Apprentice</option>
                          <option value="Graduate" className="bg-[#0F1A15]">Graduate</option>
                          <option value="Other" className="bg-[#0F1A15]">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {formData.yearGroup === 'Other' && (
                        <input
                          type="text"
                          name="yearGroupOther"
                          required
                          value={formData.yearGroupOther}
                          onChange={handleInputChange}
                          className="w-full mt-2 bg-white/5 border border-[#E8B923]/50 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] outline-none transition-all animate-in fade-in slide-in-from-top-2"
                          placeholder="Please specify..."
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Group */}
                <div className="space-y-6">
                   <div className="flex items-center gap-2 text-[#E8B923] mb-2">
                    <div className="w-1 h-4 bg-[#E8B923] rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Career Interests</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Industry <span className="text-[#E8B923]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="industry"
                          required
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0F1A15]">Select Option</option>
                          <option value="Law" className="bg-[#0F1A15]">Law</option>
                          <option value="Engineering" className="bg-[#0F1A15]">Engineering</option>
                          <option value="Technology" className="bg-[#0F1A15]">Technology</option>
                          <option value="Finance" className="bg-[#0F1A15]">Finance</option>
                          <option value="Medicine" className="bg-[#0F1A15]">Medicine</option>
                          <option value="Business" className="bg-[#0F1A15]">Business</option>
                          <option value="Creative" className="bg-[#0F1A15]">Creative</option>
                          <option value="Other" className="bg-[#0F1A15]">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {formData.industry === 'Other' && (
                        <input
                          type="text"
                          name="industryOther"
                          required
                          value={formData.industryOther}
                          onChange={handleInputChange}
                          className="w-full mt-2 bg-white/5 border border-[#E8B923]/50 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] outline-none transition-all animate-in fade-in slide-in-from-top-2"
                          placeholder="Please specify..."
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Pathway <span className="text-[#E8B923]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="pathway"
                          required
                          value={formData.pathway}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0F1A15]">Select Option</option>
                          <option value="University" className="bg-[#0F1A15]">University</option>
                          <option value="Apprenticeship" className="bg-[#0F1A15]">Apprenticeship</option>
                          <option value="Direct Employment" className="bg-[#0F1A15]">Direct Employment</option>
                          <option value="Entrepreneurship" className="bg-[#0F1A15]">Entrepreneurship</option>
                          <option value="Other" className="bg-[#0F1A15]">Other</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {formData.pathway === 'Other' && (
                        <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-2">
                          <p className="text-[11px] text-white/45">Common entries (you can still type your own):</p>
                          <div className="flex flex-wrap gap-2">
                            {['University / Apprenticeship', 'Degree Apprenticeship', 'Not sure yet'].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, pathwayOther: suggestion }))}
                                className="px-2.5 py-1 rounded-lg text-xs bg-white/10 border border-white/10 text-white/75 hover:border-[#E8B923]/40 hover:text-white transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            name="pathwayOther"
                            required
                            value={formData.pathwayOther}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-[#E8B923]/50 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] outline-none transition-all"
                            placeholder="Please specify..."
                          />
                        </div>
                      )}

                      {formData.pathway !== '' && formData.pathway !== 'Other' && (
                        <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2">
                          <label className="text-[11px] font-bold text-white/45 uppercase ml-1">
                            Optional Second Pathway (if unsure)
                          </label>
                          <div className="relative">
                            <select
                              name="pathwaySecondary"
                              value={formData.pathwaySecondary}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-[#0F1A15]">No second pathway</option>
                              <option value="University" className="bg-[#0F1A15]">University</option>
                              <option value="Apprenticeship" className="bg-[#0F1A15]">Apprenticeship</option>
                              <option value="Direct Employment" className="bg-[#0F1A15]">Direct Employment</option>
                              <option value="Entrepreneurship" className="bg-[#0F1A15]">Entrepreneurship</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Widening Participation Section */}
                <div className="border border-[#E8B923]/20 rounded-2xl p-6 bg-[#E8B923]/5 space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-[#E8B923]/10 rounded-full shrink-0 text-[#E8B923]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                     </div>
                     <div>
                        <h4 className="text-white font-bold text-lg">Help Us Support You</h4>
                        <p className="text-white/50 text-xs mt-1 leading-relaxed">Required for funding that keeps our events more affordable. Your data is anonymized and confidential when used.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        First in family to attend uni?
                      </label>
                      <div className="relative">
                        <select
                          name="firstGenUniversity"
                          value={formData.firstGenUniversity}
                          onChange={handleInputChange}
                          className="w-full bg-[#0F1A15] border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Prefer not to say</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Received free school meals?
                      </label>
                      <div className="relative">
                        <select
                          name="freeSchoolMeals"
                          value={formData.freeSchoolMeals}
                          onChange={handleInputChange}
                          className="w-full bg-[#0F1A15] border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Prefer not to say</option>
                          <option value="yes">Yes, currently or previously</option>
                          <option value="no">No</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Care experience?
                      </label>
                      <div className="relative">
                        <select
                          name="careExperience"
                          value={formData.careExperience}
                          onChange={handleInputChange}
                          className="w-full bg-[#0F1A15] border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Prefer not to say</option>
                          <option value="yes">Yes, care leaver or in care</option>
                          <option value="no">No</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase ml-1">
                        Home postcode (first half)
                      </label>
                      <input
                        type="text"
                        name="postcodeArea"
                        value={formData.postcodeArea}
                        onChange={handleInputChange}
                        className="w-full bg-[#0F1A15] border border-white/10 rounded-xl p-3.5 pl-4 text-white placeholder-white/20 focus:border-[#E8B923] focus:ring-1 focus:ring-[#E8B923]/20 outline-none transition-all"
                        placeholder="e.g. E1, M1"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                {/* How did you hear about us */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#E8B923] mb-2">
                    <div className="w-1 h-4 bg-[#E8B923] rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">How Did You Find Us?</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase ml-1">
                      How did you hear about LEAF? <span className="text-[#E8B923]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="referralSource"
                        required
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 px-4 text-white focus:border-[#E8B923] outline-none focus:ring-1 focus:ring-[#E8B923]/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0F1A15]">Select an option</option>
                        <optgroup label="Social Media" className="bg-[#0F1A15]">
                          <option value="Instagram" className="bg-[#0F1A15]">Instagram</option>
                          <option value="TikTok" className="bg-[#0F1A15]">TikTok</option>
                          <option value="Twitter / X" className="bg-[#0F1A15]">Twitter / X</option>
                          <option value="LinkedIn" className="bg-[#0F1A15]">LinkedIn</option>
                          <option value="Facebook" className="bg-[#0F1A15]">Facebook</option>
                          <option value="YouTube" className="bg-[#0F1A15]">YouTube</option>
                        </optgroup>
                        <optgroup label="Word of Mouth" className="bg-[#0F1A15]">
                          <option value="Friends & Family" className="bg-[#0F1A15]">Friends &amp; Family</option>
                          <option value="School / Teacher" className="bg-[#0F1A15]">School / Teacher</option>
                        </optgroup>
                        <option value="Other" className="bg-[#0F1A15]">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer mb-5 select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#E8B923] focus:ring-[#E8B923]/30 accent-[#E8B923]"
                    />
                    <span className="text-white/50 text-xs leading-relaxed">
                      I agree to the{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#E8B923]/80 underline hover:text-[#E8B923] transition-colors">Privacy Policy &amp; Terms of Service</a>.
                      By joining, I consent to receiving the LEAF newsletter and promotional emails. You can unsubscribe at any time.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting || !termsAccepted}
                    className="w-full bg-gradient-to-r from-[#3ECF8E] to-[#1F6B4A] hover:from-[#3ECF8E]/90 hover:to-[#1F6B4A]/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8B923]/20"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Securing your spot...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 text-lg">
                        Join The Network
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                  <p className="text-center text-white/30 text-xs mt-4">
                    Your data is handled in accordance with our privacy policy.
                  </p>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityForm
