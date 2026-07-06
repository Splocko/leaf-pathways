'use client'

import React from 'react'
import { LayoutDashboard, Users, Calendar, Settings, LogOut, BarChart3, FileText, Video, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }: AdminSidebarProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'webinars', label: 'Webinars', icon: Video },
    { id: 'communities', label: 'Communities', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static top-0 left-0 h-full w-64 bg-[#0A3D2E] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-lg text-white">LEAF <span className="text-white/50 font-normal">Admin</span></span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                activeTab === tab.id 
                  ? "text-white bg-forest-green/40 border border-gold/50" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {activeTab === tab.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.7)]" />
              )}
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-gold" : "group-hover:text-gold transition-colors")} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
