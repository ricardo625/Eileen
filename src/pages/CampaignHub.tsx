import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Check,
  Tag,
  Search,
  Play,
  Pause,
  Copy,
  Archive,
  ArrowUpRight,
  DollarSign,
  Store,
  CheckCircle2,
  Clock,
  FileEdit,
  User,
  Layers,
  X,
  Zap,
  Target,
  BarChart2,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'
import userAvatar from '../assets/avatar.png'

// ─── Header ───────────────────────────────────────────────────────────────────

const brands = ['Saint Viviana', 'Casa Morena', 'The Ridge Cellars', 'Vino Rosso']

function Header({ activeBrand, setActiveBrand }: { activeBrand: string; setActiveBrand: (b: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="h-[80px] flex items-center justify-between px-[32px] border-b border-[#f1f5f9] bg-white shrink-0">
      <div className="flex items-center gap-[10px]">
        <div className="text-[24px] font-bold text-[#0f172a] font-heading leading-none">Campaign Hub</div>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-[4px] px-[10px] py-[4px] rounded-full bg-[#f1f5f9] text-[12px] font-medium text-[#566166] font-inter hover:bg-[#e2e8f0] transition-colors"
          >
            <Tag size={11} strokeWidth={2} />
            {activeBrand}
            <ChevronDown size={11} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-[180px] bg-white rounded-[12px] border border-[#e2e8f0] shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.12)] py-[4px] overflow-hidden">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => { setActiveBrand(brand); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-[8px] px-[12px] py-[8px] text-left hover:bg-[#f8fafc] transition-colors"
                >
                  <span className={`text-[12px] font-inter ${brand === activeBrand ? 'font-semibold text-[#0f172a]' : 'font-medium text-[#566166]'}`}>
                    {brand}
                  </span>
                  {brand === activeBrand && <Check size={12} className="text-[#6366f1] shrink-0" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Plus size={13} strokeWidth={2.5} />
          Create Campaign
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          Bulk Actions
          <ChevronDown size={11} strokeWidth={2} />
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shadow-sm">
          <Sparkles size={13} strokeWidth={2} />
          AI Assist
        </button>
        <div className="ml-[8px] pl-[8px] border-l border-[#e2e8f0] flex items-center gap-[8px]">
          <DarkModeToggle />
          <div className="size-[32px] rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src={userAvatar} alt="avatar" className="size-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── AI Summary Bar ───────────────────────────────────────────────────────────

function AISummaryBar({ summary, onAutoFix }: { summary: CampaignSummary; onAutoFix: () => void }) {
  return (
    <div className="bg-[#1e293b] rounded-t-xl px-[32px] py-[13px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[6px]">
          <AlertTriangle size={13} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">{summary.attention}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <TrendingDown size={13} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">{summary.underperforming}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <Lightbulb size={13} className="text-[#818cf8]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">{summary.opportunities}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-[12px] text-white/60 font-inter italic">"{summary.quote}"</span>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        <button className="px-[13px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors">
          View Issues
        </button>
        <button
          onClick={onAutoFix}
          className="flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
        >
          <Sparkles size={11} strokeWidth={2} />
          Auto-Fix Suggestions
        </button>
      </div>
    </div>
  )
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const filterTabs = ['All', 'Active', 'Draft', 'Completed', 'Needs Attention']

const tabCounts: Record<string, number> = {
  All: 3,
  Active: 2,
  Draft: 1,
  Completed: 0,
  'Needs Attention': 1,
}

function FilterTabs({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex items-center gap-[4px] px-[32px] py-[16px] border-b border-[#f1f5f9] bg-white shrink-0">
      {filterTabs.map((tab) => {
        const isActive = active === tab
        const count = tabCounts[tab] ?? 0
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full text-[13px] font-medium font-inter transition-colors ${
              isActive
                ? 'bg-[#e9604b] text-white font-semibold'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            {tab}
            <span className={`text-[11px] font-semibold px-[5px] py-[1px] rounded-full min-w-[18px] text-center leading-[16px] ${
              isActive ? 'bg-white/25 text-white' : 'bg-[#f1f5f9] text-[#94a3b8]'
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Campaign Cards ───────────────────────────────────────────────────────────

type CampaignStatus = 'active' | 'draft' | 'completed' | 'attention'

const statusConfig: Record<CampaignStatus, { dot: string; bannerBg: string; bannerText: string; bannerLabel: string }> = {
  attention: { dot: 'bg-[#dc2626]', bannerBg: 'bg-[#fef2f2]', bannerText: 'text-[#dc2626]', bannerLabel: 'NEEDS ATTENTION' },
  active:    { dot: 'bg-[#16a34a]', bannerBg: 'bg-[#f0fdf4]', bannerText: 'text-[#16a34a]', bannerLabel: 'ACTIVE CAMPAIGN' },
  draft:     { dot: 'bg-[#94a3b8]', bannerBg: 'bg-[#f8fafc]', bannerText: 'text-[#64748b]', bannerLabel: 'DRAFT — SETUP INCOMPLETE' },
  completed: { dot: 'bg-[#6366f1]', bannerBg: 'bg-[#eef2ff]', bannerText: 'text-[#6366f1]', bannerLabel: 'COMPLETED' },
}

interface CampaignMetric { label: string; value: string; change?: string; up?: boolean }

interface Campaign {
  id: number
  name: string
  status: CampaignStatus
  stores?: number
  responses?: number
  metrics?: CampaignMetric[]
  impact?: string
  aiInsight?: string
  setupIssues?: string[]
  actions: { label: string; variant: 'primary' | 'secondary' | 'danger' | 'ai'; icon?: React.ReactNode; to?: string }[]
}

const campaignsByBrand: Record<string, Campaign[]> = {
  'Saint Viviana': [
    {
      id: 1,
      name: 'Q1 Target Check',
      status: 'attention',
      stores: 300,
      responses: 124,
      metrics: [
        { label: 'OOS',       value: '22%', change: '+8%',  up: true },
        { label: 'Low Stock', value: '15%' },
        { label: 'Coverage',  value: '68%' },
      ],
      impact: '$12,400 at risk',
      aiInsight: 'OOS increasing in West region. 2 SKUs driving majority of issues.',
      actions: [{ label: 'View Details', variant: 'secondary', to: '/campaign-hub/1/analytics' }],
    },
    {
      id: 2,
      name: 'Pricing Audit',
      status: 'active',
      stores: 120,
      responses: 90,
      metrics: [
        { label: 'Pricing Variance', value: '18%' },
        { label: 'Compliance',       value: '72%' },
      ],
      aiInsight: 'SKU priced above competitors in 8 stores.',
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
    {
      id: 3,
      name: 'New Launch Check',
      status: 'draft',
      setupIssues: ['Missing store selection', 'Missing SKU mapping'],
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
  ],
  'Casa Morena': [
    {
      id: 1,
      name: 'Walmart OOS Response',
      status: 'attention',
      stores: 85,
      responses: 31,
      metrics: [
        { label: 'OOS',       value: '25%', change: '+11%', up: true },
        { label: 'Low Stock', value: '18%' },
        { label: 'Coverage',  value: '57%', change: '-8%',  up: true },
      ],
      impact: '$9,200 at risk',
      aiInsight: 'South region distributor delay suspected. Escalate immediately.',
      actions: [{ label: 'View Details', variant: 'secondary', to: '/campaign-hub/1/analytics' }],
    },
    {
      id: 2,
      name: 'Midwest Pricing Check',
      status: 'active',
      stores: 110,
      responses: 78,
      metrics: [
        { label: 'Pricing Variance', value: '14%' },
        { label: 'Compliance',       value: '68%' },
      ],
      aiInsight: 'Tempranillo pricing variance detected in 5 stores.',
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
    {
      id: 3,
      name: 'CVS Expansion',
      status: 'active',
      stores: 40,
      responses: 38,
      metrics: [
        { label: 'On Shelf', value: '91%' },
        { label: 'New SKUs', value: '3' },
      ],
      aiInsight: 'Ideal channel for 3 new SKU listings. High compliance score.',
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
  ],
  'The Ridge Cellars': [
    {
      id: 1,
      name: 'Q1 Shelf Audit',
      status: 'active',
      stores: 95,
      responses: 88,
      metrics: [
        { label: 'On Shelf', value: '90%' },
        { label: 'Coverage', value: '93%' },
      ],
      aiInsight: 'Strong performance across all channels. Expand facing counts.',
      actions: [{ label: 'View Details', variant: 'secondary', to: '/campaign-hub/1/analytics' }],
    },
    {
      id: 2,
      name: 'CVS Reorder Audit',
      status: 'attention',
      stores: 35,
      responses: 12,
      metrics: [
        { label: 'OOS',       value: '11%', change: '+4%', up: true },
        { label: 'Low Stock', value: '8%' },
        { label: 'Coverage',  value: '81%' },
      ],
      impact: '$2,100 at risk',
      aiInsight: 'Reorder threshold needs adjustment in Northeast stores.',
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
    {
      id: 3,
      name: 'Zinfandel Launch',
      status: 'draft',
      setupIssues: ['Missing SKU mapping', 'Pending store approval'],
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
  ],
  'Vino Rosso': [
    {
      id: 1,
      name: 'East Region Recovery',
      status: 'attention',
      stores: 100,
      responses: 42,
      metrics: [
        { label: 'OOS',       value: '18%', change: '+6%', up: true },
        { label: 'Low Stock', value: '14%' },
        { label: 'Coverage',  value: '68%', change: '-4%', up: true },
      ],
      impact: '$7,600 at risk',
      aiInsight: 'Chianti Classico OOS in 14 stores. Urgent restock required.',
      actions: [{ label: 'View Details', variant: 'secondary', to: '/campaign-hub/1/analytics' }],
    },
    {
      id: 2,
      name: 'Pricing Gap Audit',
      status: 'active',
      stores: 80,
      responses: 65,
      metrics: [
        { label: 'Pricing Gaps', value: '4 stores' },
        { label: 'Compliance',   value: '78%' },
      ],
      aiInsight: 'Sangiovese pricing gap identified in 4 Walmart stores.',
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
    {
      id: 3,
      name: 'CVS OOS Response',
      status: 'attention',
      stores: 38,
      responses: 10,
      metrics: [
        { label: 'OOS',       value: '16%', change: '+7%', up: true },
        { label: 'Low Stock', value: '12%' },
        { label: 'Coverage',  value: '72%' },
      ],
      impact: '$2,100 at risk',
      aiInsight: 'Delivery issue in Northeast CVS stores. Escalate to distributor.',
      actions: [{ label: 'View Details', variant: 'secondary' }],
    },
  ],
}

interface CampaignSummary { attention: string; underperforming: string; opportunities: string; quote: string }

const campaignSummaryByBrand: Record<string, CampaignSummary> = {
  'Saint Viviana':     { attention: '3 campaigns need attention', underperforming: '1 campaign underperforming', opportunities: '2 optimization opportunities detected', quote: "Campaign 'Q1 Target Check' has rising OOS in 12 stores" },
  'Casa Morena':       { attention: '2 campaigns need attention', underperforming: '1 campaign underperforming', opportunities: '1 expansion opportunity detected', quote: "Walmart OOS surge requires immediate distributor escalation" },
  'The Ridge Cellars': { attention: '1 campaign needs attention', underperforming: '0 campaigns underperforming', opportunities: '3 growth opportunities detected', quote: "CVS Northeast reorder threshold driving most issues" },
  'Vino Rosso':        { attention: '2 campaigns need attention', underperforming: '2 campaigns underperforming', opportunities: '1 recovery opportunity detected', quote: "East and South OOS surge needs urgent action this week" },
}

function generateCampaignAction(campaign: Campaign, key: string): AIAction {
  const oos         = campaign.metrics?.find(m => m.label === 'OOS')
  const coverage    = campaign.metrics?.find(m => m.label === 'Coverage')
  const pricing     = campaign.metrics?.find(m => m.label.toLowerCase().includes('pricing') || m.label.toLowerCase().includes('variance'))
  const compliance  = campaign.metrics?.find(m => m.label.toLowerCase().includes('compliance'))
  const responseRate = (campaign.stores && campaign.responses)
    ? `${Math.round((campaign.responses / campaign.stores) * 100)}%`
    : undefined

  if (key === 'auto-fix') {
    return {
      title: `Fix: ${campaign.name}`,
      subtitle: `AI fix · ${campaign.stores ?? 0} stores affected`,
      description: `I've analyzed ${campaign.name} across ${campaign.stores ?? 0} stores and identified the root causes. ${campaign.aiInsight ?? 'Here is my recommended action plan.'}`,
      impact: [
        { label: 'Stores targeted', value: `${campaign.stores ?? 0} stores` },
        { label: 'Revenue at risk', value: campaign.impact ?? 'Under review' },
        ...(oos          ? [{ label: 'OOS rate',      value: oos.value        }] : []),
        ...(responseRate ? [{ label: 'Response rate', value: responseRate, positive: true }] : []),
      ],
      steps: [
        { label: 'Flag priority stores',     detail: `Identify the highest-OOS stores in ${campaign.name} for P1 treatment.` },
        { label: 'Trigger reorder alerts',   detail: 'Auto-send reorder requests for critical SKUs in affected stores.' },
        { label: 'Escalate to distributors', detail: `Notify regional distributors of the OOS spike in ${campaign.name}.` },
        { label: 'Extend response window',   detail: `Extend ${campaign.name} deadline by 48 hours to allow restocking.` },
        { label: 'Enable daily monitoring',  detail: 'Set daily OOS alerts for all flagged stores until resolved.' },
      ],
      confirmLabel: `Fix ${campaign.name}`,
    }
  }

  if (key === 'optimize-pricing') {
    return {
      title: `Optimize: ${campaign.name}`,
      subtitle: `Pricing compliance · ${campaign.stores} stores`,
      description: `${campaign.name} has pricing variance detected across stores. ${campaign.aiInsight ?? 'I can align pricing to your approved price book across all affected stores.'}`,
      impact: [
        { label: 'Stores to update',  value: `${Math.min(8, campaign.stores ?? 8)} stores` },
        { label: 'Compliance gain',   value: '+15%', positive: true },
        ...(pricing     ? [{ label: pricing.label,     value: pricing.value     }] : []),
        ...(compliance  ? [{ label: compliance.label,  value: compliance.value, positive: true }] : []),
      ],
      steps: [
        { label: 'Identify variances',       detail: `Cross-reference ${campaign.name} pricing against the approved price book.` },
        { label: 'Generate correction list', detail: 'Export store-level price correction sheet for field agents.' },
        { label: 'Notify store managers',    detail: 'Send automated pricing update requests to affected managers.' },
        { label: 'Set compliance check',     detail: 'Schedule 48-hour follow-up to verify corrections applied.' },
        { label: 'Update audit log',         detail: `Record all variances and corrections in the ${campaign.name} audit trail.` },
      ],
      confirmLabel: `Fix ${campaign.name} Pricing`,
    }
  }

  // draft / create-campaign
  return {
    title: `Complete: ${campaign.name}`,
    subtitle: 'Draft campaign · Setup required',
    description: `${campaign.name} is missing required setup steps before it can launch. I can automatically complete the configuration to get it ready.`,
    impact: [
      { label: 'Setup steps missing', value: `${campaign.setupIssues?.length ?? 2} steps` },
      { label: 'Time to complete',    value: '~15 min', positive: true },
      { label: 'Est. launch',         value: '2 days',  positive: true },
      { label: 'Stores ready',        value: 'Pending' },
    ],
    steps: [
      ...(campaign.setupIssues?.map(issue => ({ label: issue, detail: `AI will auto-resolve: ${issue.toLowerCase()}.` })) ?? [
        { label: 'Complete store selection', detail: 'AI selects stores based on historical campaign data.' },
        { label: 'Map SKUs',                 detail: 'Auto-map SKUs from your most recent campaign.' },
      ]),
      { label: 'Validate configuration', detail: `Run a pre-launch check on ${campaign.name} for any remaining issues.` },
      { label: 'Schedule launch',         detail: 'Set campaign live date based on field agent availability.' },
    ],
    confirmLabel: `Complete ${campaign.name}`,
  }
}

const tabStatuses: Record<string, CampaignStatus[]> = {
  'All':             ['active', 'attention', 'draft', 'completed'],
  'Active':          ['active'],
  'Draft':           ['draft'],
  'Completed':       ['completed'],
  'Needs Attention': ['attention'],
}

function CampaignCard({ campaign, selected, onSelect, onAIInsight }: { campaign: Campaign; selected: boolean; onSelect: () => void; onAIInsight?: () => void }) {
  const navigate = useNavigate()
  const cfg = statusConfig[campaign.status]

  const leftRows: { label: string; value: string }[] = []
  if (campaign.stores !== undefined) leftRows.push({ label: 'Stores', value: `${campaign.stores}` })
  if (campaign.responses !== undefined && campaign.stores !== undefined)
    leftRows.push({ label: 'Responses', value: `${campaign.responses} / ${campaign.stores}` })
  if (campaign.impact) leftRows.push({ label: 'Impact', value: campaign.impact })

  const viewTo = campaign.actions.find((a) => a.label === 'View Details')?.to

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-[20px] border overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] cursor-pointer transition-all ${
        selected ? 'border-[#e9604b]' : 'border-black/5 hover:border-black/10'
      }`}
    >
      {/* Status banner */}
      <div className={`h-[46px] pl-[20px] flex items-center gap-[8px] shrink-0 ${cfg.bannerBg}`}>
        <div className={`size-[8px] rounded-full ${cfg.dot} shrink-0`} />
        <span className={`text-[11px] font-bold tracking-[0.5px] font-inter ${cfg.bannerText}`}>
          {cfg.bannerLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-[20px] flex flex-col gap-[14px]">

        {/* Name — full width */}
        <div className="text-[16px] font-bold leading-snug text-[#2a3439] font-heading">{campaign.name}</div>

        {/* Two-column row */}
        <div className="grid grid-cols-2 gap-[16px]">

          {/* Left — operational meta */}
          <div className="flex flex-col gap-[3px]">
            {leftRows.map((m) => (
              <div key={m.label} className="h-[24px] flex items-center gap-[6px]">
                <span className="text-[12px] font-medium text-[#94a3b8] font-inter w-[76px] shrink-0">{m.label}</span>
                <span className="text-[12px] font-semibold text-[#566166] font-inter">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Right — metrics as stat tiles or setup issues */}
          <div className="flex flex-col gap-[6px]">
            {campaign.metrics && campaign.metrics.length > 0 ? (
              <div className="flex flex-col gap-[3px]">
                {campaign.metrics.map((m) => (
                  <div key={m.label} className="h-[24px] flex items-center gap-[6px]">
                    <span className="text-[12px] font-medium text-[#94a3b8] font-inter w-[76px] shrink-0">{m.label}</span>
                    <span className="text-[12px] font-semibold text-[#566166] font-inter">{m.value}</span>
                    {m.change && (
                      <span className={`text-[11px] font-bold font-inter ${m.up ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                        {m.change}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : campaign.setupIssues && campaign.setupIssues.length > 0 ? (
              <div className="flex flex-col gap-[4px] pt-[4px]">
                {campaign.setupIssues.map((b) => (
                  <div key={b} className="h-[24px] flex items-center gap-[8px]">
                    <ChevronRight size={12} className="text-[#94a3b8] shrink-0" strokeWidth={2.5} />
                    <span className="text-[12px] font-medium text-[#566166] font-inter">{b}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* AI insight bar — full width */}
        {campaign.aiInsight && (
          <button
            onClick={(e) => { e.stopPropagation(); onAIInsight?.() }}
            className="bg-[#f8fafc] h-[38px] rounded-[12px] pl-[14px] pr-[10px] flex items-center gap-[8px] overflow-hidden shrink-0 w-full text-left hover:bg-[#f1f5f9] transition-colors group"
          >
            <Sparkles size={13} className="text-[#6366f1] shrink-0" strokeWidth={2} />
            <p className="flex-1 text-[12px] font-medium italic text-[#566166] font-inter leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
              "{campaign.aiInsight}"
            </p>
            <ChevronRight size={12} className="text-[#94a3b8] shrink-0 group-hover:text-[#6366f1] transition-colors" strokeWidth={2} />
          </button>
        )}

        {/* Footer — full width */}
        <div className="border-t border-[#f1f5f9] pt-[14px]">
          <button
            className="w-full py-[7px] rounded-[10px] bg-[#f1f5f9] text-[#566166] text-[12px] font-semibold font-inter hover:bg-[#e2e8f0] transition-colors"
            onClick={(e) => { e.stopPropagation(); if (viewTo) navigate(viewTo) }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── AI Action Drawer ─────────────────────────────────────────────────────────

interface AIAction {
  title: string
  subtitle: string
  description: string
  impact: { label: string; value: string; positive?: boolean }[]
  steps: { label: string; detail: string }[]
  confirmLabel: string
}

const aiActions: Record<string, AIAction> = {
  'create-campaign': {
    title: 'Create High-Risk Store Audit',
    subtitle: 'Suggested by AI · Based on current OOS patterns',
    description: 'Launch a targeted follow-up campaign across 12 high-risk stores where OOS has risen above threshold. AI has pre-selected stores, SKUs, and field agents.',
    impact: [
      { label: 'Stores targeted',    value: '12 stores',  positive: true },
      { label: 'Estimated recovery', value: '$8,200',     positive: true },
      { label: 'Avg time to resolve',value: '4–6 days',   positive: true },
      { label: 'SKUs at risk',       value: '3 SKUs' },
    ],
    steps: [
      { label: 'Select stores',       detail: 'AI pre-selected 12 stores based on OOS severity and location cluster.' },
      { label: 'Map SKUs',            detail: 'Cabernet Sauvignon, Sparkling Chardonnay, Pinot Noir mapped to each store.' },
      { label: 'Assign field agents', detail: '4 agents auto-assigned based on territory coverage.' },
      { label: 'Set deadlines',       detail: 'Responses due within 72 hours of launch.' },
      { label: 'Notify distributors', detail: 'Automated alerts sent to 2 regional distributors.' },
    ],
    confirmLabel: 'Launch Campaign',
  },
  'auto-fix': {
    title: 'Auto-Fix: OOS Resolution Plan',
    subtitle: 'AI-generated fix · Affects 3 active campaigns',
    description: 'Apply AI-recommended fixes across all campaigns currently flagged for attention. This includes reorder triggers, distributor escalations, and store-level alerts.',
    impact: [
      { label: 'Campaigns affected', value: '3 campaigns' },
      { label: 'Revenue protected',  value: '$12,400',    positive: true },
      { label: 'Stores updated',     value: '28 stores',  positive: true },
      { label: 'Time saved',         value: '~3 hrs',     positive: true },
    ],
    steps: [
      { label: 'Flag priority stores',      detail: 'Mark 12 stores as P1 — requires same-day restock.' },
      { label: 'Trigger reorder alerts',    detail: 'Auto-send reorder requests for Cabernet Sauvignon and Sparkling Chardonnay.' },
      { label: 'Escalate to distributors',  detail: 'Notify West region distributor of critical OOS spike.' },
      { label: 'Update campaign deadlines', detail: 'Extend Q1 Target Check response window by 48 hours.' },
      { label: 'Set monitoring triggers',   detail: 'Enable daily OOS alerts for affected stores until resolved.' },
    ],
    confirmLabel: 'Apply All Fixes',
  },
  'optimize-pricing': {
    title: 'Optimize Pricing Compliance',
    subtitle: 'AI suggestion · Pricing Audit campaign',
    description: 'Correct pricing variance detected in 8 stores and align SKU pricing to the approved price book. AI has identified the affected stores and proposed corrections.',
    impact: [
      { label: 'Stores to update',    value: '8 stores' },
      { label: 'Compliance gain',     value: '+18%',      positive: true },
      { label: 'Revenue at risk',     value: '$3,100' },
      { label: 'SKUs affected',       value: '2 SKUs' },
    ],
    steps: [
      { label: 'Identify variances',    detail: 'SKU priced $1.20–$2.40 above approved price book in 8 stores.' },
      { label: 'Generate correction list', detail: 'Export store-level price correction sheet for field agents.' },
      { label: 'Notify store managers',  detail: 'Send automated pricing update request to 8 store managers.' },
      { label: 'Set compliance check',   detail: 'Schedule 48-hour follow-up to verify corrections applied.' },
      { label: 'Update audit log',       detail: 'Record variance and correction in campaign audit trail.' },
    ],
    confirmLabel: 'Apply Price Fixes',
  },
}

function AIActionDrawer({ actionKey, campaign, onClose, onConfirm }: { actionKey: string; campaign: Campaign | null; onClose: () => void; onConfirm: () => void }) {
  const action = campaign ? generateCampaignAction(campaign, actionKey) : aiActions[actionKey]
  if (!action) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[100]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[460px] bg-white z-[101] flex flex-col" style={{ boxShadow: '-12px 0 48px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div className="px-[24px] py-[18px] border-b border-[#f1f5f9] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="size-[36px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0">
              <Sparkles size={15} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-[1px]">
              <span className="text-[14px] font-bold text-[#0f172a] font-heading leading-none">Eileen AI</span>
              <div className="flex items-center gap-[4px]">
                <div className="size-[6px] rounded-full bg-[#22c55e]" />
                <span className="text-[11px] text-[#94a3b8] font-inter">Ready to execute</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b] transition-colors p-[4px]">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-y-auto px-[20px] py-[20px] flex flex-col gap-[16px] bg-[#f8fafc]">

          {/* AI message: context */}
          <div className="flex gap-[10px] items-start">
            <div className="size-[28px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-[2px]">
              <Sparkles size={12} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
              <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">{action.description}</p>
            </div>
          </div>

          {/* AI message: impact */}
          <div className="flex gap-[10px] items-start">
            <div className="size-[28px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-[2px]">
              <Sparkles size={12} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
                <p className="text-[13px] text-[#1e293b] font-inter">Here's the expected impact:</p>
              </div>
              <div className="grid grid-cols-2 gap-[6px] pl-[0px]">
                {action.impact.map((imp) => (
                  <div key={imp.label} className="bg-white rounded-[12px] px-[12px] py-[10px] border border-[#f1f5f9] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-[2px]">
                    <span className={`text-[17px] font-bold font-heading leading-none ${imp.positive ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>{imp.value}</span>
                    <span className="text-[11px] text-[#94a3b8] font-inter">{imp.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI message: steps */}
          <div className="flex gap-[10px] items-start">
            <div className="size-[28px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-[2px]">
              <Sparkles size={12} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
                <p className="text-[13px] text-[#1e293b] font-inter">Here's my step-by-step plan:</p>
              </div>
              <div className="flex flex-col gap-[6px]">
                {action.steps.map((step, i) => (
                  <div key={step.label} className="bg-white rounded-[12px] px-[14px] py-[10px] border border-[#f1f5f9] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex gap-[10px] items-start">
                    <div className="size-[20px] rounded-full bg-[#eef2ff] flex items-center justify-center shrink-0 mt-[1px]">
                      <span className="text-[9px] font-bold text-[#6366f1] font-inter">{i + 1}</span>
                    </div>
                    <div className="flex flex-col gap-[1px]">
                      <span className="text-[12px] font-semibold text-[#0f172a] font-inter">{step.label}</span>
                      <span className="text-[11px] text-[#64748b] font-inter leading-snug">{step.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI confirmation prompt */}
          <div className="flex gap-[10px] items-start">
            <div className="size-[28px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-[2px]">
              <Sparkles size={12} className="text-white" strokeWidth={2} />
            </div>
            <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9] flex-1">
              <p className="text-[13px] text-[#1e293b] font-inter leading-[20px]">
                Ready to proceed. Should I go ahead and <strong>{action.confirmLabel.toLowerCase()}</strong>?
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-[20px] py-[16px] border-t border-[#f1f5f9] bg-white flex items-center gap-[8px] shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-[11px] rounded-[12px] border border-[#e2e8f0] text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors"
          >
            Not now
          </button>
          <button
            onClick={onConfirm}
            className="flex-[2] flex items-center justify-center gap-[7px] py-[11px] rounded-[12px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[13px] font-semibold text-white font-inter hover:opacity-90 transition-opacity"
          >
            <Sparkles size={13} strokeWidth={2} />
            {action.confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Right Insights Panel ─────────────────────────────────────────────────────

function InsightsPanel({ onClose, onSuggestion }: { onClose: () => void; onSuggestion: (key: string) => void }) {
  return (
    <div className="w-[300px] shrink-0 border-l border-[#f1f5f9] bg-white flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f1f5f9] shrink-0">
        <div className="flex items-center gap-[7px]">
          <Sparkles size={13} className="text-[#6366f1]" strokeWidth={2} />
          <span className="text-[13px] font-bold text-[#0f172a] font-inter">Campaign Insights</span>
        </div>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-[20px] py-[16px] flex flex-col gap-[16px]">

        {/* Top performing */}
        <div className="flex flex-col gap-[6px] p-[14px] rounded-[12px] bg-[#f0fdf4] border border-[#bbf7d0]">
          <div className="text-[10px] font-semibold text-[#16a34a] uppercase tracking-wide font-inter">Top Performing</div>
          <div className="text-[13px] font-bold text-[#0f172a] font-inter">Pricing Audit</div>
          <div className="text-[12px] text-[#16a34a] font-inter">75% response rate · 72% compliance</div>
          <button
            onClick={() => onSuggestion('optimize-pricing')}
            className="flex items-center gap-[5px] mt-[2px] text-[11px] font-semibold text-[#16a34a] font-inter hover:underline"
          >
            <Sparkles size={10} strokeWidth={2} />
            Optimize compliance
          </button>
        </div>

        {/* Worst performing */}
        <div className="flex flex-col gap-[6px] p-[14px] rounded-[12px] bg-[#fef2f2] border border-[#fecaca]">
          <div className="text-[10px] font-semibold text-[#dc2626] uppercase tracking-wide font-inter">Needs Attention</div>
          <div className="text-[13px] font-bold text-[#0f172a] font-inter">Q1 Target Check</div>
          <div className="text-[12px] text-[#dc2626] font-inter">OOS rising · 41% response rate</div>
          <button
            onClick={() => onSuggestion('auto-fix')}
            className="flex items-center gap-[5px] mt-[2px] text-[11px] font-semibold text-[#dc2626] font-inter hover:underline"
          >
            <Sparkles size={10} strokeWidth={2} />
            Auto-fix issues
          </button>
        </div>

        {/* Suggested */}
        <div className="flex flex-col gap-[8px] p-[14px] rounded-[12px] bg-[#f5f3ff] border border-[#e0e7ff]">
          <div className="text-[10px] font-semibold text-[#6366f1] uppercase tracking-wide font-inter">Suggested Next Campaign</div>
          <div className="text-[13px] font-bold text-[#0f172a] font-inter">High-Risk Store Audit</div>
          <div className="text-[12px] text-[#4338ca] font-inter leading-snug">"Run a follow-up check in 12 high-risk stores"</div>
          <button
            onClick={() => onSuggestion('create-campaign')}
            className="flex items-center justify-center gap-[6px] mt-[2px] px-[12px] py-[7px] rounded-[8px] bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
          >
            <Sparkles size={11} strokeWidth={2} />
            Create Campaign
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-[8px]">
          {[
            { label: 'Total Campaigns', value: '3' },
            { label: 'Stores Covered', value: '420' },
            { label: 'Avg Response', value: '62%' },
            { label: 'At-Risk Revenue', value: '$12.4k' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-[2px] p-[12px] rounded-[10px] border border-[#f1f5f9] bg-[#f8fafc]">
              <div className="text-[18px] font-bold text-[#0f172a] font-heading leading-none">{s.value}</div>
              <div className="text-[11px] text-[#94a3b8] font-inter leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Footer Bar ───────────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignHub() {
  const [activeBrand, setActiveBrand] = useState('Saint Viviana')
  const [activeTab, setActiveTab] = useState('All')
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [drawerKey, setDrawerKey] = useState<string | null>(null)
  const [drawerCampaign, setDrawerCampaign] = useState<Campaign | null>(null)

  const campaigns = campaignsByBrand[activeBrand]
  const summary = campaignSummaryByBrand[activeBrand]
  const visible = campaigns.filter(c => tabStatuses[activeTab].includes(c.status))

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header activeBrand={activeBrand} setActiveBrand={(b) => { setActiveBrand(b); setActiveTab('All'); setSelectedId(null) }} />
        <AISummaryBar summary={summary} onAutoFix={() => { setDrawerKey('auto-fix'); setDrawerCampaign(null) }} />

        {/* White canvas */}
        <div className="flex flex-col flex-1 overflow-hidden rounded-b-xl bg-white">
          <FilterTabs active={activeTab} onChange={(t) => { setActiveTab(t); setSelectedId(null) }} />

          {/* Content + panel */}
          <div className="flex flex-1 min-h-0">
            {/* Campaign list */}
            <div className="flex-1 overflow-y-auto px-[32px] py-[24px]">
              <div className="grid grid-cols-2 gap-[16px]">
                {visible.map((c) => {
                  const aiActionKey = c.status === 'attention' ? 'auto-fix' : c.status === 'active' ? 'optimize-pricing' : 'create-campaign'
                  return (
                    <CampaignCard
                      key={c.id}
                      campaign={c}
                      selected={selectedId === c.id}
                      onSelect={() => setSelectedId(selectedId === c.id ? null : c.id)}
                      onAIInsight={c.aiInsight ? () => { setDrawerKey(aiActionKey); setDrawerCampaign(c) } : undefined}
                    />
                  )
                })}
              </div>
            </div>

            {/* Right insights panel */}
            <InsightsPanel onClose={() => setSelectedId(null)} onSuggestion={(key) => { setDrawerKey(key); setDrawerCampaign(null) }} />
          </div>
        </div>
      </div>

      {/* AI Action Drawer */}
      {drawerKey && (
        <AIActionDrawer
          actionKey={drawerKey}
          campaign={drawerCampaign}
          onClose={() => { setDrawerKey(null); setDrawerCampaign(null) }}
          onConfirm={() => { setDrawerKey(null); setDrawerCampaign(null) }}
        />
      )}

      {/* Floating action bar */}
      <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
        <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
          <Pause size={14} strokeWidth={2} />
          Bulk Pause
        </button>
        <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
          <Copy size={14} strokeWidth={2} />
          Duplicate
        </button>
        <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-[#f87171] text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
          <Archive size={14} strokeWidth={2} />
          Archive
        </button>
        <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] bg-[#6366f1] text-white text-[13px] font-semibold font-inter hover:bg-[#4f46e5] transition-colors">
          <Sparkles size={14} strokeWidth={2} />
          AI Optimize All
        </button>
      </div>
    </div>
  )
}
