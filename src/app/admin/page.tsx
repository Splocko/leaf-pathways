'use client'

import React, { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { Menu, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

// Components
import AdminLogin from '@/components/admin/AdminLogin'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DashboardOverview from '@/components/admin/DashboardOverview'
import EventsManager from '@/components/admin/EventsManager'
import MembersManager from '@/components/admin/MembersManager'
import AnalyticsPage from '@/components/admin/AnalyticsPage'
import BlogManager from '@/components/admin/BlogManager'
import WebinarsManager from '@/components/admin/WebinarsManager'
import CommunitiesManager from '@/components/admin/CommunitiesManager'
import { CommunityMember, Event, BlogPost, Webinar } from '@/components/admin/types'

export default function AdminPage() {
  const { showToast } = useToast()
  
  // -- Auth State --
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // -- UI State --
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // For mobile
  
  // -- Data State --
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  // 1. Check Auth on Mount
  useEffect(() => {
    const checkAuth = async () => {
      // Logic: 
      // 1. Check localStorage for our custom "leaf_admin_session" (hardcoded fallback)
      // 2. OR check Supabase session
      try {
        const localSession = localStorage.getItem('leaf_admin_session')
        if (localSession) {
          const session = JSON.parse(localSession)
          if (session.expires_at > Date.now()) {
            setIsAuthenticated(true)
            return
          } else {
             localStorage.removeItem('leaf_admin_session')
          }
        }

        const supabase = getSupabaseClient()
        if (supabase) {
          const { data } = await supabase.auth.getSession()
          if (data.session) {
             setIsAuthenticated(true)
          }
        }
      } catch (e) {
        // console.error('Auth check failed', e)
        // Silently fail auth check for better UX (just show login)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [])

  // Defensive: ensure any SSR "loading" overlay or overflow locks are removed
  useEffect(() => {
    try {
      document.documentElement.classList.remove('loading')
      document.body.classList.remove('loading')
      // Ensure overflow is enabled so scrolling works even if CSS left it hidden
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'
      const overlay = document.getElementById('ssr-overlay')
      if (overlay && overlay.style) overlay.style.display = 'none'
    } catch (e) {
      // ignore
    }
  }, [])

  // 2. Fetch Data (Only if Auth)
  const fetchData = async () => {
    if (!isAuthenticated) return
    setIsLoadingData(true)
    
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Database connection unavailable')
      
      // Fetch Members - paginate to bypass API row limit
      let allMembers: CommunityMember[] = []
      let page = 0
      const pageSize = 1000
      let hasMore = true
      
      while (hasMore) {
        const { data: membersData, error: membersError } = await supabase
          .from('community_members')
          .select('*')
          .order('created_at', { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1)
        
        if (membersError) throw membersError
        
        if (membersData && membersData.length > 0) {
          allMembers = [...allMembers, ...membersData]
          page++
          hasMore = membersData.length === pageSize
        } else {
          hasMore = false
        }
      }
      
      setMembers(allMembers)

      // Fetch Events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      
      if (eventsError) throw eventsError
      setEvents(eventsData as Event[] || [])

      // Fetch Blog Posts
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (blogError) throw blogError
      setBlogPosts(blogData as BlogPost[] || [])

      // Fetch Webinars
      const { data: webinarsData, error: webinarsError } = await supabase
        .from('webinars')
        .select('*')
        .order('webinar_date', { ascending: false })

      if (webinarsError) throw webinarsError
      setWebinars(webinarsData as Webinar[] || [])

    } catch (err: any) {
      console.error('Data fetch error:', err)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    const supabase = getSupabaseClient()
    if (!supabase) return

    // Business rule: website members only increase after completed signups.
    const channel = supabase
      .channel('public:admin-community-members-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_members' },
        (payload) => {
          const incomingMember = payload.new as CommunityMember
          setMembers((prev) => {
            if (prev.some((member) => member.id === incomingMember.id)) {
              return prev
            }
            return [incomingMember, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAuthenticated])

  // -- Handlers --

  const handleLogout = async () => {
    localStorage.removeItem('leaf_admin_session')
    const supabase = getSupabaseClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setIsAuthenticated(false)
    // Reload to clear state completely
    window.location.reload()
  }

  // Loading State (Initial)
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0A3D2E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  // Not Authenticated -> Login Screen
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  // Authenticated -> Dashboard Layout
  return (
    <div className="min-h-screen bg-[#0A3D2E] flex relative font-poppins text-white">
      
      {/* Sidebar Component */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto w-full relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-4 sticky top-0 bg-[#0A3D2E]/95 backdrop-blur z-30">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white/70 hover:text-white">
             <Menu className="w-6 h-6" />
           </button>
           <span className="font-bold">LEAF Admin</span>
           <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-20">
            {/* Header / Title */}
            <div className="mb-8 flex items-center justify-between">
               <div className="animate-in slide-in-from-left-4 duration-500">
                  <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h1>
                  <p className="text-white/50 text-sm mt-1">Manage your community and content</p>
               </div>
               {activeTab !== 'overview' && (
                 <button 
                  onClick={fetchData} 
                  disabled={isLoadingData}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 border border-white/10 hover:border-[#D4AF37]/30"
                  title="Refresh Data"
                 >
                   <Loader2 className={isLoadingData ? "animate-spin text-[#D4AF37]" : "text-white/70"} size={20} />
                 </button>
               )}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in zoom-in-95 duration-300">
              {activeTab === 'overview' && (
                <DashboardOverview members={members} events={events} />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsPage members={members} />
              )}

              {activeTab === 'events' && (
                <EventsManager events={events} onRefresh={fetchData} />
              )}

              {activeTab === 'members' && (
                <MembersManager members={members} />
              )}

              {activeTab === 'blog' && (
                <BlogManager posts={blogPosts} onRefresh={fetchData} />
              )}

              {activeTab === 'webinars' && (
                <WebinarsManager webinars={webinars} onRefresh={fetchData} />
              )}

              {activeTab === 'communities' && (
                <CommunitiesManager />
              )}

              {activeTab === 'settings' && (
                <div className="bg-forest-green/50 border border-white/10 rounded-2xl p-12 text-center">
                   <div className="text-white/30 text-lg">Settings module coming soon.</div>
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  )
}
