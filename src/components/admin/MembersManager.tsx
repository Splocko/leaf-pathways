'use client'

import React, { useState } from 'react'
import { Search, Download, Filter, Mail, MapPin, Briefcase } from 'lucide-react'
import { CommunityMember } from './types'
import { cn } from '@/lib/utils'

interface MembersManagerProps {
  members: CommunityMember[]
}

export default function MembersManager({ members }: MembersManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Derive Industries
  const industries = ['All', ...Array.from(new Set(members.map(m => m.industry).filter(Boolean)))]

  // Filter Logic
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      (m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (m.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    
    const matchesIndustry = industryFilter === 'All' || m.industry === industryFilter

    return matchesSearch && matchesIndustry
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = filteredMembers.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleExport = () => {
    // Simple CSV Export
    const headers = ['ID', 'Name', 'Email', 'Industry', 'Pathway', 'Location', 'Joined At']
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(m => [
        m.id, 
        `"${m.full_name}"`, 
        m.email, 
        `"${m.industry}"`, 
        `"${m.pathway}"`, 
        `"${m.location}"`, 
        new Date(m.created_at).toISOString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `leaf_members_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#062419] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <select 
               value={industryFilter}
               onChange={(e) => setIndustryFilter(e.target.value)}
               className="bg-[#062419] border border-white/10 rounded-xl py-2 pl-10 pr-8 text-sm text-white focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
             >
               {industries.map(ind => (
                 <option key={ind} value={ind}>{ind}</option>
               ))}
             </select>
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="w-full md:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-forest-green/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#062419] border-b border-white/10">
                <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Member Profile</th>
                <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Industry & Pathway</th>
                <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/30">
                     No members found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A3D2E]/40 flex items-center justify-center text-[#D4AF37] font-bold border border-[#D4AF37]/20">
                          {member.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{member.full_name || 'Unknown User'}</div>
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-white">
                          <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]/70" />
                          {member.industry || '—'}
                        </div>
                        <div className="text-xs text-white/50 pl-5">
                          {member.pathway || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-white/70">
                         <MapPin className="w-3.5 h-3.5 text-white/30" />
                         {member.location || 'Unknown'}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="text-sm text-white/60">
                         {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
             <div className="text-xs text-white/40">
               Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredMembers.length)} of {filteredMembers.length}
             </div>
             <div className="flex gap-2">
               <button 
                 disabled={page === 1}
                 onClick={() => setPage(p => p - 1)}
                 className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-sm transition-colors"
               >
                 Previous
               </button>
               <button 
                 disabled={page === totalPages}
                 onClick={() => setPage(p => p + 1)}
                 className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-sm transition-colors"
               >
                 Next
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
