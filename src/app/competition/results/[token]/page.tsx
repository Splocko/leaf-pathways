import { notFound } from 'next/navigation'
import { Download, Award, TrendingUp, TrendingDown } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Results | LEAF Engineering Innovation Competition 2026',
  description: 'View your personalised score report and download your certificate.',
}

const KPI_CONFIG = [
  { key: 'practicality',   label: 'Practicality',   color: '#00C2FF' },
  { key: 'profitability',  label: 'Profitability',  color: '#D4AF37' },
  { key: 'creativity',     label: 'Creativity',     color: '#10B981' },
  { key: 'sustainability', label: 'Sustainability', color: '#8B5CF6' },
  { key: 'presentation',   label: 'Presentation',   color: '#F59E0B' },
] as const

type Participant = {
  person_id:        string
  scenario:         string
  type:             'solo' | 'duo'
  full_name:        string
  cert_name_line:   string
  education_stage:  string
  city:             string
  partner_name:     string
  practicality:     number
  profitability:    number
  creativity:       number
  sustainability:   number
  presentation:     number
  total_score:      number
  strongest_comment: string
  weakest_comment:   string
  cert_pdf_url:     string
  report_pdf_url:   string
}

function ScoreGauge({ score, max }: { score: number; max: number }) {
  const pct    = Math.min(score / max, 1)
  const r      = 40
  const circ   = 2 * Math.PI * r
  const color  = pct >= 0.75 ? '#10B981' : pct >= 0.5 ? '#D4AF37' : '#EF4444'
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#083024" strokeWidth="12" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${pct * circ} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400">/ {max}</span>
      </div>
    </div>
  )
}

async function getParticipant(token: string): Promise<Participant | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  // Without server env configured, degrade to "not found" rather than crashing.
  if (!url || !key) return null
  try {
    const res = await fetch(
      `${url}/rest/v1/competition_participants?access_token=eq.${encodeURIComponent(token)}&select=*&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    const rows = await res.json()
    return rows[0] ?? null
  } catch {
    return null
  }
}

export default async function CompetitionResultsPage({
  params,
}: {
  params: { token: string }
}) {
  const p = await getParticipant(params.token)
  if (!p) notFound()

  const scores = [
    p.practicality,
    p.profitability,
    p.creativity,
    p.sustainability,
    p.presentation,
  ]
  const strongestIdx = scores.indexOf(Math.max(...scores))
  const weakestIdx   = scores.indexOf(Math.min(...scores))
  const pct = p.total_score / 50

  const gradeLabel =
    pct >= 0.9  ? 'Outstanding'  :
    pct >= 0.75 ? 'Excellent'    :
    pct >= 0.6  ? 'Strong'       :
    pct >= 0.5  ? 'Good'         : 'Participation'

  return (
    <div className="min-h-screen bg-[#062419] text-white">

      {/* Gold top bar */}
      <div className="h-1 bg-[#D4AF37]" />

      {/* Header */}
      <div className="bg-[#0A3D2E]">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-[#00C2FF] tracking-widest uppercase mb-1">
              LEAF Pathways × AtkinsRéalis
            </p>
            <h1 className="text-lg font-bold text-white leading-snug">
              Engineering Innovation Competition 2026
            </h1>
          </div>
          <span className="shrink-0 text-sm font-semibold text-[#D4AF37] bg-[#0B1B34] px-3 py-1 rounded-full border border-[#D4AF37]/20">
            Scenario {p.scenario}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* Identity card */}
        <div className="rounded-2xl bg-[#0A3D2E] border border-[#D4AF37]/20 p-6">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2">Score Report</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] leading-tight">
            {p.cert_name_line}
          </h2>
          {p.type === 'duo' && p.partner_name && (
            <p className="text-sm text-[#00C2FF] mt-1">Duo entry with {p.partner_name}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {p.education_stage && (
              <span className="text-xs bg-[#0B1B34] text-gray-300 px-3 py-1 rounded-full">
                {p.education_stage}
              </span>
            )}
            {p.city && (
              <span className="text-xs bg-[#0B1B34] text-gray-300 px-3 py-1 rounded-full">
                {p.city}
              </span>
            )}
            <span className="text-xs bg-[#0B1B34] text-[#10B981] px-3 py-1 rounded-full font-semibold">
              {gradeLabel}
            </span>
          </div>
        </div>

        {/* Score gauge + KPI bars */}
        <div className="rounded-2xl bg-[#0B1B34] border border-white/5 p-6">
          <div className="flex items-center gap-6 mb-6">
            <ScoreGauge score={p.total_score} max={50} />
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">Total Score</p>
              <p className="text-4xl font-bold text-white">
                {p.total_score}
                <span className="text-xl text-gray-500">/50</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{Math.round(pct * 100)}%</p>
            </div>
          </div>

          <div className="space-y-3">
            {KPI_CONFIG.map((kpi, i) => (
              <div key={kpi.key} className="flex items-center gap-3">
                <span className="w-28 text-right text-sm text-gray-400 shrink-0">{kpi.label}</span>
                <div className="flex-1 h-2.5 rounded-full bg-[#083024]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${scores[i] * 10}%`, backgroundColor: kpi.color }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-10 shrink-0 text-right">
                  {scores[i]}/10
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI score mini-cards */}
        <div className="grid grid-cols-5 gap-2">
          {KPI_CONFIG.map((kpi, i) => (
            <div
              key={kpi.key}
              className="rounded-xl bg-[#0A3D2E] border border-white/5 p-3 text-center"
            >
              <div
                className="h-0.5 w-6 mx-auto mb-2 rounded-full"
                style={{ backgroundColor: kpi.color }}
              />
              <p className="text-xl font-bold text-white">{scores[i]}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                {kpi.label.slice(0, 7)}
              </p>
            </div>
          ))}
        </div>

        {/* Strongest KPI */}
        <div className="rounded-2xl bg-[#062419] border border-[#10B981]/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#10B981] shrink-0" />
            <p className="text-sm font-semibold text-[#10B981]">
              Strongest KPI — {KPI_CONFIG[strongestIdx].label} ({scores[strongestIdx]}/10)
            </p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{p.strongest_comment}</p>
        </div>

        {/* Area for growth */}
        <div className="rounded-2xl bg-[#062419] border border-[#D4AF37]/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <p className="text-sm font-semibold text-[#D4AF37]">
              Area for Growth — {KPI_CONFIG[weakestIdx].label} ({scores[weakestIdx]}/10)
            </p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{p.weakest_comment}</p>
        </div>

        {/* Download buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href={p.cert_pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B1B34] font-bold py-3.5 px-5 rounded-xl hover:bg-[#c4a030] active:scale-95 transition-all"
          >
            <Award className="w-4 h-4" />
            Download Certificate
          </a>
          <a
            href={p.report_pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0A3D2E] text-white font-semibold py-3.5 px-5 rounded-xl border border-[#00C2FF]/30 hover:bg-[#0d4f3b] active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Score Report
          </a>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-white/5 mt-6 py-5">
        <p className="text-center text-xs text-gray-600">
          LEAF Pathways · leafpathways.com · Engineering Innovation Competition 2026 · Confidential
        </p>
      </div>

    </div>
  )
}
