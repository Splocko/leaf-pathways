'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Users, GraduationCap, Home, Utensils, Heart, MapPin, TrendingUp, Calendar } from 'lucide-react'
import { CommunityMember } from './types'

interface AnalyticsPageProps {
  members: CommunityMember[]
}

export default function AnalyticsPage({ members }: AnalyticsPageProps) {
  const totalMembers = members.length

  const normalizePathway = (rawValue: string | null | undefined): string => {
    const raw = String(rawValue ?? '').trim()
    if (!raw) return 'Not Specified'

    // Normalise text: lowercase, collapse spaces, standardise synonyms
    const value = raw.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/degree apprenticeship/g, 'apprenticeship')
      .replace(/uni\b/g, 'university')

    if (/not sure|all the above/.test(value)) return 'Mixed / Unsure'

    // Split on "/" or "," separators to handle combos stored in any order
    const parts = value.split(/\s*[\/,]\s*/).map(p => p.trim()).filter(Boolean)

    const categorise = (p: string): string | null => {
      if (/university/.test(p)) return 'University'
      if (/apprenticeship/.test(p)) return 'Apprenticeship'
      if (/direct employment|employment|job/.test(p)) return 'Direct Employment'
      if (/entrepreneur/.test(p)) return 'Entrepreneurship'
      return null
    }

    // Deduplicate and sort so "A / B" and "B / A" produce the same key
    const categories = Array.from(new Set(parts.map(categorise).filter(Boolean) as string[])).sort()

    if (categories.length === 0) return 'Other'
    if (categories.length === 1) return categories[0]
    // Two categories: show as combined e.g. "Apprenticeship / University"
    return categories.join(' / ')
  }

  const normalizeEthnicity = (raw: string | null | undefined): string => {
    const val = String(raw ?? '').trim().toLowerCase()
    if (!val || val === 'unknown') return 'Not Specified'
    if (val === 'prefer not to say') return 'Prefer Not to Say'
    if (val.startsWith('asian')) return 'Asian or Asian British'
    if (val.startsWith('black')) return 'Black, African, Caribbean or Black British'
    if (val.startsWith('mixed')) return 'Mixed or Multiple Ethnic Groups'
    if (val.startsWith('white')) return 'White'
    if (val.startsWith('other - arab')) return 'Arab'
    if (val.startsWith('other')) return 'Other Ethnic Group'
    // legacy broad values from before the form update
    if (val === 'asian') return 'Asian or Asian British'
    if (val === 'black') return 'Black, African, Caribbean or Black British'
    if (val === 'mixed') return 'Mixed or Multiple Ethnic Groups'
    if (val === 'white') return 'White'
    return 'Other Ethnic Group'
  }

  // --- Helper function to count by field ---
  const countByField = (field: keyof CommunityMember): Record<string, number> => {
    return members.reduce((acc, m) => {
      const val = String(m[field] ?? 'Unknown')
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  // --- Derived Stats ---

  // 1. Ethnicity Distribution (normalised into ONS broad groups)
  const ethnicityCounts = members.reduce((acc, m) => {
    const group = normalizeEthnicity(m.race_ethnicity)
    acc[group] = (acc[group] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const ethnicityData = Object.entries(ethnicityCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 1b. Detailed ethnicity subcategory breakdown grouped under broad ONS parent
  const cleanEthnicityLabel = (raw: string): string => {
    // Strip the "Group - " prefix and return just the subcategory name
    const val = raw.trim()
    const dashIdx = val.indexOf(' - ')
    if (dashIdx !== -1) return val.substring(dashIdx + 3).trim()
    // Legacy broad single-word values — map to proper label
    const legacyMap: Record<string, string> = {
      'Asian': 'Other Asian background (legacy)',
      'Black': 'Other Black background (legacy)',
      'Mixed': 'Other Mixed background (legacy)',
      'White': 'Other White background (legacy)',
      'Other': 'Other ethnic group',
      'Prefer not to say': 'Prefer not to say',
    }
    return legacyMap[val] ?? val
  }

  // Group detailed values under their broad parent
  const BROAD_ORDER = [
    'Asian or Asian British',
    'Black, African, Caribbean or Black British',
    'Mixed or Multiple Ethnic Groups',
    'White',
    'Arab',
    'Other Ethnic Group',
    'Prefer Not to Say',
    'Not Specified',
  ]

  const ethnicityGrouped: Record<string, { label: string; count: number }[]> = {}
  BROAD_ORDER.forEach(g => { ethnicityGrouped[g] = [] })

  members.forEach(m => {
    const raw = String(m.race_ethnicity ?? '').trim()
    if (!raw) return
    const broadGroup = normalizeEthnicity(raw)
    const subcategory = cleanEthnicityLabel(raw)
    const existing = ethnicityGrouped[broadGroup]?.find(e => e.label === subcategory)
    if (existing) {
      existing.count++
    } else if (ethnicityGrouped[broadGroup]) {
      ethnicityGrouped[broadGroup].push({ label: subcategory, count: 1 })
    }
  })

  // Remove empty groups and sort subcategories by count desc
  const ethnicityGroupedFiltered = BROAD_ORDER
    .filter(g => ethnicityGrouped[g]?.length > 0)
    .map(g => ({
      group: g,
      subcategories: ethnicityGrouped[g].sort((a, b) => b.count - a.count),
    }))

  // 2. Pathway Distribution (Sixth Form, Uni, Apprenticeship, etc.)
  const pathwayCounts = members.reduce((acc, member) => {
    const normalized = normalizePathway(member.pathway)
    acc[normalized] = (acc[normalized] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pathwayData = Object.entries(pathwayCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 3. Year Group / Education Stage — show top 10 only, rest grouped into Other
  const rawYearGroupEntries = Object.entries(countByField('year_group'))
    .map(([name, value]) => ({ name: name || 'Not Specified', value }))
    .sort((a, b) => b.value - a.value)
  const yearGroupTop = rawYearGroupEntries.slice(0, 10)
  const yearGroupOtherSum = rawYearGroupEntries.slice(10).reduce((s, e) => s + e.value, 0)
  const yearGroupData = yearGroupOtherSum > 0
    ? [...yearGroupTop, { name: 'Other', value: yearGroupOtherSum }]
    : yearGroupTop

  // 4. Age Distribution (group into buckets)
  const ageBuckets: Record<string, number> = { '14-16': 0, '17-18': 0, '19-21': 0, '22-25': 0, '26+': 0 }
  members.forEach(m => {
    const age = m.age
    if (!age) return
    if (age <= 16) ageBuckets['14-16']++
    else if (age <= 18) ageBuckets['17-18']++
    else if (age <= 21) ageBuckets['19-21']++
    else if (age <= 25) ageBuckets['22-25']++
    else ageBuckets['26+']++
  })
  const ageData = Object.entries(ageBuckets).map(([name, value]) => ({ name, value }))

  // 5. Widening Participation Metrics
  const wpMetrics = {
    firstGen: members.filter(m => m.first_gen_university === true).length,
    freeSchoolMeals: members.filter(m => m.free_school_meals === true).length,
    careExperience: members.filter(m => m.care_experience === true).length,
  }

  // 6. Regional Distribution (Postcode Areas)
  const postcodeData = Object.entries(countByField('postcode_area'))
    .filter(([name]) => name && name !== 'Unknown' && name !== 'null')
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Top 10 regions

  // 6b. Location (City/Town) Distribution — normalise case/spacing to merge duplicates
  const normalizeLocation = (raw: string) =>
    raw.trim().toLowerCase().replace(/\s+/g, ' ').replace(/(^|\s)\S/g, c => c.toUpperCase())

  const locationCounts = members.reduce((acc, m) => {
    const raw = String(m.location ?? '').trim()
    if (!raw || raw === 'Unknown' || raw === 'null' || raw === 'undefined') return acc
    const key = normalizeLocation(raw)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const locationData = Object.entries(locationCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 8. Referral Source Distribution
  const referralSourceData = Object.entries(
    members.reduce((acc, m) => {
      const val = String((m as any).referral_source ?? '').trim() || 'Not Specified'
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 7. Industry Distribution (top industries)
  const industryData = Object.entries(countByField('industry'))
    .map(([name, value]) => ({ name: name || 'Not Specified', value }))
    .sort((a, b) => b.value - a.value)

  // 7. Monthly Sign-ups (last 6 months)
  const now = new Date()
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return { month: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }), date: d }
  }).reverse()
  
  const monthlySignups = last6Months.map(({ month, date }) => {
    const count = members.filter(m => {
      const created = new Date(m.created_at)
      return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear()
    }).length
    return { name: month, signups: count }
  })

  const PATHWAY_SHORT: Record<string, string> = {
    'Apprenticeship': 'Apprenticeship',
    'University': 'University',
    'Direct Employment': 'Direct Emp.',
    'Entrepreneurship': 'Entrep.',
    'Mixed / Unsure': 'Mixed / Unsure',
    'Other': 'Other',
    'Not Specified': 'Not Specified',
  }
  const formatPathwayLabel = (name: string) =>
    name.split(' / ').map(p => PATHWAY_SHORT[p] ?? p).join(' / ')

  // Colors for charts, aligned with brand aesthetics
  const BRAND_COLORS = [
    '#D4AF37', // Gold
    '#0A3D2E', // Dark Forest Green
    '#1E8449', // Vibrant Green
    '#F5B041', // Amber
    '#A04000', // Earthy Brown
    '#14B8A6', // Teal
    '#6366f1', // Indigo
    '#EC4899', // Pink
    '#8E44AD', // Purple
    '#3498DB', // Blue
  ]

  // --- Reusable Components ---

  const MetricCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-forest-green/50 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-gold/30 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/50 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-white/40 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )

  const ChartCard = ({ title, children, className = '' }: any) => (
    <div className={`bg-forest-green/50 border border-white/10 rounded-2xl p-6 hover:border-gold/20 transition-colors ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gold rounded-full" />
        {title}
      </h3>
      {children}
    </div>
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{label || payload[0].name}</p>
          <p className="text-gold">{payload[0].value} members</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Section Header */}
      <div className="mb-2">
        <p className="text-white/50 text-sm">Deep dive into community demographics and widening participation data.</p>
      </div>

      {/* Widening Participation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Members" 
          value={totalMembers} 
          icon={Users} 
          color="#D4AF37"
          subtext="All registered"
        />
        <MetricCard 
          title="First Gen University" 
          value={wpMetrics.firstGen} 
          icon={GraduationCap} 
          color="#0EA56B"
          subtext={`${totalMembers > 0 ? ((wpMetrics.firstGen / totalMembers) * 100).toFixed(1) : 0}% of total`}
        />
        <MetricCard 
          title="Free School Meals" 
          value={wpMetrics.freeSchoolMeals} 
          icon={Utensils} 
          color="#00C2FF"
          subtext={`${totalMembers > 0 ? ((wpMetrics.freeSchoolMeals / totalMembers) * 100).toFixed(1) : 0}% of total`}
        />
        <MetricCard 
          title="Care Experienced" 
          value={wpMetrics.careExperience} 
          icon={Heart} 
          color="#EC4899"
          subtext={`${totalMembers > 0 ? ((wpMetrics.careExperience / totalMembers) * 100).toFixed(1) : 0}% of total`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ethnicity Breakdown */}
        <ChartCard title="Ethnic Background" className="min-h-[400px]">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ethnicityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ethnicityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3 max-h-[200px] overflow-y-auto pr-1">
            {ethnicityGroupedFiltered.map((group) => {
              const groupTotal = group.subcategories.reduce((s, e) => s + e.count, 0)
              const color = BRAND_COLORS[ethnicityData.findIndex(e => e.name === group.group) % BRAND_COLORS.length]
              return (
                <div key={group.group}>
                  {/* Broad group header */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs font-semibold text-white">{group.group}</span>
                    <span className="ml-auto text-xs font-mono text-white/60">{groupTotal}</span>
                  </div>
                  {/* Subcategories — only show if more than one distinct subcategory */}
                  {group.subcategories.length > 1 && (
                    <div className="pl-5 space-y-0.5">
                      {group.subcategories.map(sub => (
                        <div key={sub.label} className="flex items-center gap-2 text-xs text-white/50">
                          <span className="truncate">{sub.label}</span>
                          <span className="ml-auto font-mono">{sub.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Age Distribution */}
        <ChartCard title="Age Distribution" className="min-h-[400px]">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff70" fontSize={12} />
                <YAxis stroke="#ffffff50" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pathway / Education Stage */}
        <ChartCard title="Pathway Distribution" className="min-h-[480px]">
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathwayData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#ffffff70"
                  width={160}
                  interval={0}
                  tick={(props: any) => {
                    const { x, y, payload } = props
                    return (
                      <text x={x} y={y} dy={4} textAnchor="end" fill="#ffffff90" fontSize={11}>
                        {formatPathwayLabel(payload.value)}
                      </text>
                    )
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#1E8449" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Year Group */}
        <ChartCard title="Year Group" className="min-h-[400px]">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearGroupData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#ffffff70" 
                  fontSize={11} 
                  tick={{ fill: '#ffffff90' }} 
                  width={100}
                  interval={0}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#F5B041" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Regional Distribution */}
        <ChartCard title="Top Regions (Postcode Areas)" className="min-h-[350px]">
          {postcodeData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-white/30">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No postcode data available yet.</p>
              </div>
            </div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postcodeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff70" fontSize={11} />
                  <YAxis stroke="#ffffff50" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        {/* Monthly Sign-ups Trend */}
        <ChartCard title="Monthly Sign-ups (Last 6 Months)" className="min-h-[350px]">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySignups} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff70" fontSize={11} />
                <YAxis stroke="#ffffff50" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A3D2E', borderColor: '#ffffff20', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                  labelStyle={{ color: '#ffffff90' }}
                />
                <Bar dataKey="signups" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Sign-ups" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Members by Location (City / Town) */}
      <ChartCard title="Members by Location" className="min-h-[350px]">
        {locationData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-white/30">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No location data available yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart — top 15 locations */}
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationData.slice(0, 15)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#ffffff70"
                    fontSize={11}
                    tick={{ fill: '#ffffff90' }}
                    width={110}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Full ranked list */}
            <div className="max-h-[340px] overflow-y-auto pr-2 space-y-1">
              {locationData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-mono text-white/30 w-5 text-right shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm text-white/80 truncate">{entry.name}</span>
                  <span className="text-sm font-bold text-[#14B8A6] shrink-0">{entry.value}</span>
                  <div
                    className="h-1.5 rounded-full bg-[#14B8A6]/40 shrink-0"
                    style={{ width: `${Math.max(8, (entry.value / locationData[0].value) * 60)}px` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartCard>

      {/* Industry Distribution (Top Industries) */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ChartCard title="Top Industries" className="min-h-[300px]">
          {industryData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-white/30">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No industry data available yet.</p>
              </div>
            </div>
          ) : (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#ffffff70" 
                    fontSize={11} 
                    tick={{ fill: '#ffffff90' }} 
                    width={140} 
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* How Members Found Us */}
      <ChartCard title="How Members Found Us" className="min-h-[300px]">
        {referralSourceData.length === 0 || (referralSourceData.length === 1 && referralSourceData[0].name === 'Not Specified') ? (
          <div className="h-[220px] flex items-center justify-center text-white/30">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No referral data yet — available after new members join.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralSourceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#ffffff70"
                    fontSize={11}
                    tick={{ fill: '#ffffff90' }}
                    width={130}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                    {referralSourceData.map((_, index) => (
                      <Cell key={`ref-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="max-h-[260px] overflow-y-auto pr-2 space-y-1">
              {referralSourceData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: BRAND_COLORS[index % BRAND_COLORS.length] }} />
                  <span className="flex-1 text-sm text-white/80 truncate">{entry.name}</span>
                  <span className="text-sm font-bold text-white shrink-0">{entry.value}</span>
                  <span className="text-xs text-white/50 shrink-0">
                    {totalMembers > 0 ? `${((entry.value / totalMembers) * 100).toFixed(1)}%` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-forest-green/20 border border-forest-green/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{ethnicityData.length}</div>
          <div className="text-xs text-white/50 mt-1">Ethnic Backgrounds</div>
        </div>
        <div className="bg-gold/20 border border-gold/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{pathwayData.length}</div>
          <div className="text-xs text-white/50 mt-1">Education Pathways</div>
        </div>
        <div className="bg-cyan/20 border border-cyan/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{postcodeData.length}+</div>
          <div className="text-xs text-white/50 mt-1">UK Regions Reached</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {((wpMetrics.firstGen + wpMetrics.freeSchoolMeals + wpMetrics.careExperience) / Math.max(totalMembers, 1) * 100 / 3).toFixed(0)}%
          </div>
          <div className="text-xs text-white/50 mt-1">WP Indicator Avg.</div>
        </div>
      </div>

    </div>
  )
}
