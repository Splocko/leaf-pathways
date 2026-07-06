'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react'
import { CommunityMember, Event } from './types'

const LEGACY_WHATSAPP_MEMBERS = 2000

interface DashboardOverviewProps {
  members: CommunityMember[]
  events: Event[]
}

export default function DashboardOverview({ members, events }: DashboardOverviewProps) {
  // --- Derived Stats ---
  const totalMembers = members.length
  const displayedTotalMembers = totalMembers + LEGACY_WHATSAPP_MEMBERS
  const totalEvents = events.length
  const activeEvents = events.filter(e => e.is_active).length
  
  // Calculate Growth based on member created_at dates
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0) // Last day of previous month
  
  const membersThisMonth = members.filter(m => {
    const d = new Date(m.created_at)
    return d >= thisMonthStart
  }).length
  
  const membersLastMonth = members.filter(m => {
    const d = new Date(m.created_at)
    return d >= lastMonthStart && d <= lastMonthEnd
  }).length
  
  // Calculate growth percentage (compare this month's new members to last month's)
  const growthPercentage = membersLastMonth > 0 
    ? Math.round(((membersThisMonth - membersLastMonth) / membersLastMonth) * 100)
    : membersThisMonth > 0 ? 100 : 0

  // --- Charts Data Preparation ---

  const normalizePathway = (rawValue: string | null | undefined): string => {
    const raw = String(rawValue ?? '').trim()
    if (!raw) return 'Not Specified'
    const value = raw.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/degree apprenticeship/g, 'apprenticeship')
      .replace(/uni\b/g, 'university')
    if (/not sure|all the above/.test(value)) return 'Mixed / Unsure'
    const parts = value.split(/\s*[\/,]\s*/).map(p => p.trim()).filter(Boolean)
    const categorise = (p: string): string | null => {
      if (/university/.test(p)) return 'University'
      if (/apprenticeship/.test(p)) return 'Apprenticeship'
      if (/direct employment|employment|job/.test(p)) return 'Direct Employment'
      if (/entrepreneur/.test(p)) return 'Entrepreneurship'
      return null
    }
    const categories = Array.from(new Set(parts.map(categorise).filter(Boolean) as string[])).sort()
    if (categories.length === 0) return 'Other'
    if (categories.length === 1) return categories[0]
    return categories.join(' / ')
  }

  // 1. Members by Industry
  const industryStats = members.reduce((acc, member) => {
    const ind = member.industry || 'Unknown'
    acc[ind] = (acc[ind] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const industryData = Object.entries(industryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5

  // 2. Members by Pathway (normalised so reversed-order combos merge)
  const pathwayStats = members.reduce((acc, member) => {
    const path = normalizePathway(member.pathway)
    acc[path] = (acc[path] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pathwayData = Object.entries(pathwayStats)
    .map(([name, value]) => ({ name, value }))

  // 10 unique brand-aligned colors — one per pathway, no repeats
  const COLORS = [
    '#D4AF37', // Gold
    '#0A3D2E', // Dark Forest Green
    '#3498DB', // Sky Blue
    '#1E8449', // Vibrant Green
    '#E67E22', // Warm Orange
    '#8E44AD', // Royal Purple
    '#14B8A6', // Teal
    '#EC4899', // Pink
    '#6366f1', // Indigo
    '#A04000', // Earthy Brown
  ]

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-forest-green/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-gold/30 transition-all">
       <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
         <Icon className="w-24 h-24" color={color} />
       </div>
       <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-[${color}]/10`}>
              <Icon className="w-5 h-5" color={color} />
            </div>
            <h3 className="text-white/60 font-medium text-sm">{title}</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{value}</div>
          <p className="text-xs text-white/40">{subtext}</p>
       </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value={displayedTotalMembers} 
          subtext={`+${membersThisMonth} this month`} 
          icon={Users} 
          color="#D4AF37"  
        />
        <StatCard 
          title="Active Events" 
          value={activeEvents} 
          subtext={`${totalEvents} total created`} 
          icon={Calendar} 
          color="#0EA56B" 
        />
        <StatCard 
          title="Engagement" 
          value={`${Math.min(100, Math.round((activeEvents / Math.max(totalEvents, 1)) * 100))}%`} 
          subtext="Active events rate" 
          icon={Activity} 
          color="#00C2FF" 
        />
        <StatCard 
          title="Growth" 
          value={`${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%`} 
          subtext="New members vs last month" 
          icon={TrendingUp} 
          color="#F59E0B" // Amber
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Industry Distribution */}
        <div className="bg-forest-green/50 border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col hover:border-gold/20 transition-colors">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"/>
            Members by Industry
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                <YAxis dataKey="name" type="category" width={100} stroke="#ffffff80" fontSize={12} tick={{fill: '#ffffff80'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A3D2E', borderColor: '#ffffff20', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                  cursor={{fill: '#ffffff05'}}
                />
                <Bar dataKey="value" fill="#0EA56B" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pathway Distribution */}
        <div className="bg-forest-green/50 border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col hover:border-gold/20 transition-colors">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gold rounded-full"/>
            Members by Pathway
          </h3>
          <div className="flex-1 w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pathwayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pathwayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0A3D2E', borderColor: '#ffffff20', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend because Recharts legend can be finicky in flex containers */}
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center pointer-events-none">
              <span className="text-3xl font-bold text-white">{totalMembers}</span>
              <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Total</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {pathwayData.map((entry, index) => (
               <div key={index} className="flex items-center gap-2 text-xs text-white/70">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                 <span className="truncate">{entry.name}</span>
                 <span className="ml-auto font-mono text-white">{entry.value}</span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  )
}
