'use client'

import React, { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast'
import { Loader2, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommunitySettings {
  whatsapp_group_unlocked: boolean
  whatsapp_group2_unlocked: boolean
  whatsapp_group3_unlocked: boolean
}

export default function CommunitiesManager() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<CommunitySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState<'c1' | 'c2' | 'c3' | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Client unavailable')
      const { data, error } = await (supabase.from('app_settings') as any)
        .select('whatsapp_group_unlocked, whatsapp_group2_unlocked, whatsapp_group3_unlocked')
        .eq('setting_key', 'global')
        .single()
      if (error) throw error
      setSettings({
        whatsapp_group_unlocked: data.whatsapp_group_unlocked ?? false,
        whatsapp_group2_unlocked: data.whatsapp_group2_unlocked ?? true,
        whatsapp_group3_unlocked: data.whatsapp_group3_unlocked ?? true,
      })
    } catch {
      showToast('Failed to load community settings', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggle = async (community: 'c1' | 'c2' | 'c3') => {
    if (!settings) return
    setSaving(community)

    const column =
      community === 'c1' ? 'whatsapp_group_unlocked' : community === 'c2' ? 'whatsapp_group2_unlocked' : 'whatsapp_group3_unlocked'
    const currentValue =
      community === 'c1' ? settings.whatsapp_group_unlocked : community === 'c2' ? settings.whatsapp_group2_unlocked : settings.whatsapp_group3_unlocked
    const newValue = !currentValue
    const label = community === 'c1' ? 'Community 1' : community === 'c2' ? 'Community 2' : 'Community 3'

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error('Client unavailable')
      const { error } = await (supabase.from('app_settings') as any)
        .update({ [column]: newValue })
        .eq('setting_key', 'global')
      if (error) throw error
      setSettings(prev => prev ? { ...prev, [column]: newValue } : prev)
      showToast(`${label} ${newValue ? 'opened' : 'locked'}`, 'success')
    } catch {
      showToast(`Failed to update ${label}`, 'error')
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
      </div>
    )
  }

  const communities = [
    {
      id: 'c1' as const,
      label: 'LEAF Community 1',
      unlocked: settings?.whatsapp_group_unlocked ?? false,
      link: 'https://chat.whatsapp.com/J0XG09wZbsuDRCs5whHluh',
    },
    {
      id: 'c2' as const,
      label: 'LEAF Community 2',
      unlocked: settings?.whatsapp_group2_unlocked ?? true,
      link: 'https://chat.whatsapp.com/DqC8F459qKc9aJQfz1ElIz',
    },
    {
      id: 'c3' as const,
      label: 'LEAF Community 3',
      unlocked: settings?.whatsapp_group3_unlocked ?? true,
      link: 'https://chat.whatsapp.com/EY2MdzmCft9ImkkYUBhmrF',
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-white/50 text-sm">
        Toggle communities open or full. Changes take effect immediately for new sign-ups.
      </p>

      <div className="space-y-4">
        {communities.map(({ id, label, unlocked, link }) => (
          <div
            key={id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <h3 className="font-bold text-white text-lg">{label}</h3>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-[#D4AF37]/70 transition-colors truncate block max-w-xs"
              >
                {link}
              </a>
              <div className="pt-1">
                {unlocked ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Open
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Full / Locked
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => toggle(id)}
              disabled={saving === id}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap disabled:opacity-50',
                unlocked
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20'
              )}
            >
              {saving === id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : unlocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              {unlocked ? 'Lock (Mark Full)' : 'Open'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
