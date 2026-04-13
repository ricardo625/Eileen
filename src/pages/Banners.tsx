import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  AlertTriangle,
  DollarSign,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Check,
  Store,
  X,
  Send,
  Bot,
  Download,
  SlidersHorizontal,
  ArrowUpRight,
  MapPin,
  Rocket,
  Megaphone,
  Tag,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'
import userAvatar from '../assets/avatar.png'

// ─── Types ────────────────────────────────────────────────────────────────────

type RetailerRisk = 'high' | 'medium' | 'opportunity'

interface Region { name: string; status: 'high' | 'medium' | 'stable' }
interface TopIssue { sku: string; detail: string }

interface Retailer {
  id: number
  name: string
  logo: string
  stores: number
  risk: RetailerRisk
  metrics: { label: string; value: string; change?: string; up?: boolean }[]
  impact?: string
  insight: string
  insightType: 'risk' | 'opportunity'
  regions: Region[]
  topIssues: TopIssue[]
  actions: { label: string; ai?: boolean }[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const riskConfig: Record<RetailerRisk, { bannerBg: string; bannerText: string; bannerLabel: string; dot: string }> = {
  high:        { bannerBg: 'bg-[#fef2f2]', bannerText: 'text-[#dc2626]', bannerLabel: 'HIGH RISK — ACTION REQUIRED', dot: 'bg-[#dc2626]' },
  medium:      { bannerBg: 'bg-[#fff7ed]', bannerText: 'text-[#ea580c]', bannerLabel: 'MODERATE — MONITOR CLOSELY',  dot: 'bg-[#ea580c]' },
  opportunity: { bannerBg: 'bg-[#f0fdf4]', bannerText: 'text-[#16a34a]', bannerLabel: 'OPPORTUNITY DETECTED',         dot: 'bg-[#16a34a]' },
}

const regionDot: Record<Region['status'], string> = {
  high:   '🔴',
  medium: '🟠',
  stable: '🟢',
}

interface BrandSummary {
  alert: string
  atRisk: string
  positive: string
  quote: string
}

const retailersByBrand: Record<string, Retailer[]> = {
  'Saint Viviana': [
    {
      id: 1, name: 'Target', logo: 'T', stores: 120, risk: 'high',
      metrics: [
        { label: 'OOS', value: '22%', change: '+8%', up: true },
        { label: 'Low Stock', value: '15%' },
        { label: 'On Shelf', value: '63%', change: '-5%', up: true },
      ],
      impact: '$12,400 at risk',
      insight: 'OOS concentrated in West region. 2 SKUs driving majority.',
      insightType: 'risk',
      regions: [{ name: 'West', status: 'high' }, { name: 'Midwest', status: 'medium' }, { name: 'East', status: 'stable' }],
      topIssues: [{ sku: 'Cabernet Sauvignon', detail: 'OOS in 12 stores' }, { sku: 'Sparkling Chardonnay', detail: 'Low stock in 8 stores' }],
      actions: [{ label: 'View Stores' }, { label: 'Fix Issues', ai: true }],
    },
    {
      id: 2, name: 'Walmart', logo: 'W', stores: 90, risk: 'medium',
      metrics: [
        { label: 'OOS', value: '12%' },
        { label: 'Low Stock', value: '10%' },
        { label: 'On Shelf', value: '78%' },
      ],
      impact: '$4,800 at risk',
      insight: 'Stable overall but declining stock detected in 6 stores.',
      insightType: 'risk',
      regions: [{ name: 'South', status: 'medium' }, { name: 'Central', status: 'stable' }, { name: 'East', status: 'stable' }],
      topIssues: [{ sku: 'Pinot Noir 750ml', detail: 'Low stock trend in South' }, { sku: 'Rosé Collection', detail: 'Facing reduction in 6 stores' }],
      actions: [{ label: 'View Stores' }, { label: 'Monitor' }],
    },
    {
      id: 3, name: 'CVS', logo: 'C', stores: 45, risk: 'opportunity',
      metrics: [
        { label: 'OOS', value: '8%' },
        { label: 'Low Stock', value: '6%' },
        { label: 'On Shelf', value: '86%' },
      ],
      insight: 'High compliance — strong opportunity to expand SKUs in this channel.',
      insightType: 'opportunity',
      regions: [{ name: 'Northeast', status: 'stable' }, { name: 'Southeast', status: 'stable' }, { name: 'West', status: 'medium' }],
      topIssues: [{ sku: 'Chardonnay Reserve', detail: 'Not yet listed in 12 stores' }, { sku: 'Sparkling Rosé', detail: 'Expansion opportunity' }],
      actions: [{ label: 'View Stores' }, { label: 'Expand Presence', ai: true }],
    },
  ],
  'Casa Morena': [
    {
      id: 1, name: 'Target', logo: 'T', stores: 110, risk: 'medium',
      metrics: [
        { label: 'OOS', value: '14%', change: '+3%', up: true },
        { label: 'Low Stock', value: '12%' },
        { label: 'On Shelf', value: '74%' },
      ],
      impact: '$6,300 at risk',
      insight: 'Moderate OOS in Midwest. Pricing variance in 5 stores.',
      insightType: 'risk',
      regions: [{ name: 'Midwest', status: 'medium' }, { name: 'South', status: 'medium' }, { name: 'East', status: 'stable' }],
      topIssues: [{ sku: 'Malbec Reserve', detail: 'Low stock in 9 stores' }, { sku: 'Tempranillo', detail: 'Pricing variance in 5 stores' }],
      actions: [{ label: 'View Stores' }, { label: 'Monitor' }],
    },
    {
      id: 2, name: 'Walmart', logo: 'W', stores: 85, risk: 'high',
      metrics: [
        { label: 'OOS', value: '25%', change: '+11%', up: true },
        { label: 'Low Stock', value: '18%' },
        { label: 'On Shelf', value: '57%', change: '-8%', up: true },
      ],
      impact: '$9,200 at risk',
      insight: 'Significant OOS surge in South region. Distributor delay suspected.',
      insightType: 'risk',
      regions: [{ name: 'South', status: 'high' }, { name: 'Central', status: 'high' }, { name: 'West', status: 'medium' }],
      topIssues: [{ sku: 'Malbec Reserve', detail: 'OOS in 18 stores' }, { sku: 'Crianza Blend', detail: 'Distributor delay flagged' }],
      actions: [{ label: 'View Stores' }, { label: 'Fix Issues', ai: true }],
    },
    {
      id: 3, name: 'CVS', logo: 'C', stores: 40, risk: 'opportunity',
      metrics: [
        { label: 'OOS', value: '5%' },
        { label: 'Low Stock', value: '4%' },
        { label: 'On Shelf', value: '91%' },
      ],
      insight: 'Best-performing channel. Room to add 3 new SKUs.',
      insightType: 'opportunity',
      regions: [{ name: 'Northeast', status: 'stable' }, { name: 'Southeast', status: 'stable' }, { name: 'West', status: 'stable' }],
      topIssues: [{ sku: 'Crianza Blend', detail: 'Not listed in 8 stores' }, { sku: 'Tempranillo', detail: 'Expansion opportunity' }],
      actions: [{ label: 'View Stores' }, { label: 'Expand Presence', ai: true }],
    },
  ],
  'The Ridge Cellars': [
    {
      id: 1, name: 'Target', logo: 'T', stores: 95, risk: 'opportunity',
      metrics: [
        { label: 'OOS', value: '6%' },
        { label: 'Low Stock', value: '4%' },
        { label: 'On Shelf', value: '90%' },
      ],
      insight: 'Excellent shelf presence. Opportunity to increase facings.',
      insightType: 'opportunity',
      regions: [{ name: 'West', status: 'stable' }, { name: 'Midwest', status: 'stable' }, { name: 'East', status: 'stable' }],
      topIssues: [{ sku: 'Cabernet Reserve', detail: 'Facing count low in 6 stores' }, { sku: 'Zinfandel', detail: 'Not listed in 4 stores' }],
      actions: [{ label: 'View Stores' }, { label: 'Expand Presence', ai: true }],
    },
    {
      id: 2, name: 'Walmart', logo: 'W', stores: 70, risk: 'opportunity',
      metrics: [
        { label: 'OOS', value: '9%' },
        { label: 'Low Stock', value: '7%' },
        { label: 'On Shelf', value: '84%' },
      ],
      insight: 'Performing above category average. Monitor seasonal demand.',
      insightType: 'opportunity',
      regions: [{ name: 'West', status: 'stable' }, { name: 'South', status: 'stable' }, { name: 'Central', status: 'medium' }],
      topIssues: [{ sku: 'Zinfandel', detail: 'Seasonal demand spike expected' }, { sku: 'Cabernet Reserve', detail: 'Slight overstock in Central' }],
      actions: [{ label: 'View Stores' }, { label: 'Monitor' }],
    },
    {
      id: 3, name: 'CVS', logo: 'C', stores: 35, risk: 'medium',
      metrics: [
        { label: 'OOS', value: '11%', change: '+4%', up: true },
        { label: 'Low Stock', value: '8%' },
        { label: 'On Shelf', value: '81%' },
      ],
      impact: '$2,100 at risk',
      insight: 'Stock dipping in Northeast. Reorder threshold may need adjustment.',
      insightType: 'risk',
      regions: [{ name: 'Northeast', status: 'medium' }, { name: 'Southeast', status: 'stable' }, { name: 'West', status: 'stable' }],
      topIssues: [{ sku: 'Pinot Grigio', detail: 'Low stock in 7 stores' }, { sku: 'Cabernet Reserve', detail: 'Reorder delay flagged' }],
      actions: [{ label: 'View Stores' }, { label: 'Fix Issues', ai: true }],
    },
  ],
  'Vino Rosso': [
    {
      id: 1, name: 'Target', logo: 'T', stores: 100, risk: 'high',
      metrics: [
        { label: 'OOS', value: '18%', change: '+6%', up: true },
        { label: 'Low Stock', value: '14%' },
        { label: 'On Shelf', value: '68%', change: '-4%', up: true },
      ],
      impact: '$7,600 at risk',
      insight: 'OOS rising in East and South. 3 SKUs need urgent restock.',
      insightType: 'risk',
      regions: [{ name: 'East', status: 'high' }, { name: 'South', status: 'high' }, { name: 'West', status: 'medium' }],
      topIssues: [{ sku: 'Chianti Classico', detail: 'OOS in 14 stores' }, { sku: 'Primitivo', detail: 'Low stock in 10 stores' }],
      actions: [{ label: 'View Stores' }, { label: 'Fix Issues', ai: true }],
    },
    {
      id: 2, name: 'Walmart', logo: 'W', stores: 80, risk: 'medium',
      metrics: [
        { label: 'OOS', value: '10%' },
        { label: 'Low Stock', value: '8%' },
        { label: 'On Shelf', value: '82%' },
      ],
      impact: '$3,200 at risk',
      insight: 'Generally stable but 4 stores showing pricing gaps.',
      insightType: 'risk',
      regions: [{ name: 'Central', status: 'stable' }, { name: 'South', status: 'medium' }, { name: 'West', status: 'stable' }],
      topIssues: [{ sku: 'Sangiovese', detail: 'Pricing gap in 4 stores' }, { sku: 'Primitivo', detail: 'Low stock in South' }],
      actions: [{ label: 'View Stores' }, { label: 'Monitor' }],
    },
    {
      id: 3, name: 'CVS', logo: 'C', stores: 38, risk: 'high',
      metrics: [
        { label: 'OOS', value: '16%', change: '+7%', up: true },
        { label: 'Low Stock', value: '12%' },
        { label: 'On Shelf', value: '72%', change: '-6%', up: true },
      ],
      impact: '$2,100 at risk',
      insight: 'Unexpected OOS spike this week. Delivery issue suspected.',
      insightType: 'risk',
      regions: [{ name: 'Northeast', status: 'high' }, { name: 'Southeast', status: 'medium' }, { name: 'West', status: 'stable' }],
      topIssues: [{ sku: 'Chianti Classico', detail: 'Delivery delay in Northeast' }, { sku: 'Barbera d\'Asti', detail: 'OOS in 6 stores' }],
      actions: [{ label: 'View Stores' }, { label: 'Fix Issues', ai: true }],
    },
  ],
}

const brandSummaryData: Record<string, BrandSummary> = {
  'Saint Viviana':    { alert: 'Target showing highest OOS (+8%)', atRisk: '$18,200 at risk across 3 retailers', positive: '2 retailers outperforming baseline', quote: 'Target and Walmart are driving 70% of issues' },
  'Casa Morena':      { alert: 'Walmart OOS surged +11% this week', atRisk: '$15,500 at risk across 2 retailers', positive: 'CVS outperforming category average', quote: 'Walmart South region is the primary risk driver' },
  'The Ridge Cellars':{ alert: 'CVS stock dipping in Northeast (+4%)', atRisk: '$2,100 at risk — lowest across brands', positive: 'Target and Walmart both above baseline', quote: 'Strong overall performance — CVS needs monitoring' },
  'Vino Rosso':       { alert: 'OOS rising across all 3 retailers', atRisk: '$12,900 at risk across 3 retailers', positive: 'Walmart holding stable in Central region', quote: 'East and South regions driving majority of issues' },
}

// ─── AI Action Drawer ─────────────────────────────────────────────────────────

interface BannerAIAction {
  title: string
  description: string
  impact: { label: string; value: string; positive?: boolean }[]
  steps: { label: string; detail: string }[]
  confirmLabel: string
}

function generateBannerAction(retailer: Retailer, key: string): BannerAIAction {
  const oos      = retailer.metrics.find(m => m.label === 'OOS')
  const onShelf  = retailer.metrics.find(m => m.label === 'On Shelf')
  const lowStock = retailer.metrics.find(m => m.label === 'Low Stock')
  const badRegion = retailer.regions.find(r => r.status === 'high') ?? retailer.regions.find(r => r.status === 'medium')

  if (key === 'expand-presence') {
    return {
      title: `Expand at ${retailer.name}`,
      description: `${retailer.name} is performing above baseline with ${onShelf?.value ?? 'strong'} on-shelf compliance across ${retailer.stores} stores. ${retailer.insight}`,
      impact: [
        { label: 'Stores targeted',    value: `${retailer.stores} stores`, positive: true },
        { label: 'On-shelf rate',      value: onShelf?.value ?? '—',       positive: true },
        { label: 'SKU opportunity',    value: '2–3 new SKUs',              positive: true },
        { label: 'Est. upside',        value: '+$3,200',                   positive: true },
      ],
      steps: [
        { label: `List ${retailer.topIssues[0]?.sku ?? 'top SKU'}`, detail: retailer.topIssues[0]?.detail ?? 'Identify primary expansion opportunity.' },
        ...(retailer.topIssues[1] ? [{ label: `Expand ${retailer.topIssues[1].sku}`, detail: retailer.topIssues[1].detail }] : []),
        { label: 'Request facing increase', detail: `Ask for 2 additional facings per SKU across ${retailer.stores} ${retailer.name} stores.` },
        { label: 'Submit ranging request',  detail: 'Send new SKU listing request to the buyer for next review cycle.' },
        { label: 'Track sell-through',      detail: 'Monitor new SKU velocity weekly for the first 4 weeks post-launch.' },
      ],
      confirmLabel: `Expand at ${retailer.name}`,
    }
  }

  // fix-issues / deploy-plan
  return {
    title: `Fix ${retailer.name} Issues`,
    description: `I've identified the root causes of OOS and low-stock issues across ${retailer.stores} ${retailer.name} stores. ${retailer.insight}`,
    impact: [
      { label: 'Stores affected', value: `${retailer.stores} stores` },
      { label: 'Revenue at risk', value: retailer.impact ?? 'Under review' },
      { label: 'OOS rate',        value: oos?.value ?? '—' },
      { label: 'Low stock',       value: lowStock?.value ?? '—' },
    ],
    steps: [
      { label: `Restock ${retailer.topIssues[0]?.sku ?? 'critical SKU'}`, detail: retailer.topIssues[0]?.detail ?? 'Address the top OOS issue immediately.' },
      ...(retailer.topIssues[1] ? [{ label: `Address ${retailer.topIssues[1].sku}`, detail: retailer.topIssues[1].detail }] : []),
      ...(badRegion ? [{ label: `Prioritize ${badRegion.name} region`, detail: `Focus immediate restock on high-OOS ${retailer.name} stores in ${badRegion.name}.` }] : []),
      { label: 'Dispatch field agents', detail: `Assign agents to the highest-risk ${retailer.name} stores for same-day visits.` },
      { label: 'Enable monitoring',     detail: 'Set daily OOS alerts for all affected stores until the issue is resolved.' },
    ],
    confirmLabel: `Fix ${retailer.name} Issues`,
  }
}

function BannerAIDrawer({ actionKey, retailer, onClose, onConfirm }: { actionKey: string; retailer: Retailer | null; onClose: () => void; onConfirm: () => void }) {
  if (!retailer) return null
  const action = generateBannerAction(retailer, actionKey)

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[100]" onClick={onClose} />
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

          {/* Impact grid */}
          <div className="flex gap-[10px] items-start">
            <div className="size-[28px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0 mt-[2px]">
              <Sparkles size={12} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col gap-[8px]">
              <div className="bg-white rounded-[16px] rounded-tl-[4px] px-[14px] py-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
                <p className="text-[13px] text-[#1e293b] font-inter">Here's the expected impact:</p>
              </div>
              <div className="grid grid-cols-2 gap-[6px]">
                {action.impact.map((imp) => (
                  <div key={imp.label} className="bg-white rounded-[12px] px-[12px] py-[10px] border border-[#f1f5f9] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-[2px]">
                    <span className={`text-[17px] font-bold font-heading leading-none ${imp.positive ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>{imp.value}</span>
                    <span className="text-[11px] text-[#94a3b8] font-inter">{imp.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
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

          {/* Confirmation prompt */}
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

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const tabFilters = ['All Retailers', 'High Risk', 'Opportunities']
const tabRisks: Record<string, RetailerRisk[]> = {
  'All Retailers':  ['high', 'medium', 'opportunity'],
  'High Risk':      ['high', 'medium'],
  'Opportunities':  ['opportunity'],
}

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
        <div className="text-[24px] font-bold text-[#0f172a] font-heading leading-none">Banners</div>
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
          <SlidersHorizontal size={13} strokeWidth={2} />
          Filters
          <ChevronDown size={11} strokeWidth={2} />
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Download size={13} strokeWidth={2} />
          Export
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

function AISummaryBar({ summary }: { summary: BrandSummary }) {
  return (
    <div className="bg-[#1e293b] rounded-t-xl px-[32px] py-[13px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[24px] flex-wrap">
        <div className="flex items-center gap-[6px]">
          <AlertTriangle size={13} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">{summary.alert}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <DollarSign size={13} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">{summary.atRisk}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <Lightbulb size={13} className="text-[#86efac]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">{summary.positive}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-[12px] text-white/60 font-inter italic">
          "{summary.quote}"
        </span>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        <button className="px-[13px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors">
          View Priority Retailers
        </button>
        <button className="flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors">
          <Sparkles size={11} strokeWidth={2} />
          Fix Issues
        </button>
      </div>
    </div>
  )
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

function FilterTabs({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  const counts: Record<string, number> = { 'All Retailers': 3, 'High Risk': 2, 'Opportunities': 1 }
  return (
    <div className="flex items-center gap-[4px] px-[32px] py-[16px] border-b border-[#f1f5f9] bg-white shrink-0">
      {tabFilters.map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full text-[13px] font-medium font-inter transition-colors ${
              isActive ? 'bg-[#e9604b] text-white font-semibold' : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            {tab}
            <span className={`text-[11px] font-semibold px-[5px] py-[1px] rounded-full min-w-[18px] text-center leading-[16px] ${
              isActive ? 'bg-white/25 text-white' : 'bg-[#f1f5f9] text-[#94a3b8]'
            }`}>
              {counts[tab]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Retailer Card ────────────────────────────────────────────────────────────

function RetailerCard({
  retailer,
  selected,
  onSelect,
  onAIAction,
}: {
  retailer: Retailer
  selected: boolean
  onSelect: () => void
  onAIAction: (key: string) => void
}) {
  const cfg = riskConfig[retailer.risk]

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-[20px] border overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] cursor-pointer transition-all ${
        selected ? 'border-[#e9604b]' : 'border-black/5 hover:border-black/10'
      }`}
    >
      {/* Banner */}
      <div className={`h-[46px] pl-[20px] flex items-center gap-[8px] shrink-0 ${cfg.bannerBg}`}>
        <div className={`size-[8px] rounded-full shrink-0 ${cfg.dot}`} />
        <span className={`text-[11px] font-bold tracking-[0.5px] font-inter ${cfg.bannerText}`}>
          {cfg.bannerLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-[20px] flex flex-col gap-[14px]">
        {/* Name + stores */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="size-[36px] rounded-[10px] bg-[#f1f5f9] flex items-center justify-center">
              <span className="text-[14px] font-bold text-[#566166] font-heading">{retailer.logo}</span>
            </div>
            <div className="flex flex-col gap-[1px]">
              <span className="text-[16px] font-bold text-[#2a3439] font-heading leading-none">{retailer.name}</span>
              <div className="flex items-center gap-[4px] text-[#94a3b8]">
                <Store size={10} strokeWidth={2} />
                <span className="text-[11px] font-medium font-inter">{retailer.stores} stores</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column metrics */}
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[3px]">
          {retailer.metrics.map((m) => (
            <div key={m.label} className="h-[24px] flex items-center gap-[6px]">
              <span className="text-[12px] font-medium text-[#94a3b8] font-inter w-[64px] shrink-0">{m.label}</span>
              <span className="text-[12px] font-semibold text-[#566166] font-inter">{m.value}</span>
              {m.change && (
                <span className={`text-[11px] font-bold font-inter flex items-center gap-[1px] ${m.up ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                  {m.up ? <ArrowUpRight size={10} strokeWidth={2.5} /> : <TrendingDown size={10} strokeWidth={2.5} />}
                  {m.change}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Impact / opportunity */}
        {retailer.impact && (
          <div className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] bg-[#fff7ed] border border-[#fed7aa]">
            <DollarSign size={12} className="text-[#ea580c]" strokeWidth={2.5} />
            <span className="text-[12px] font-semibold text-[#ea580c] font-inter">Impact: {retailer.impact}</span>
          </div>
        )}

        {/* AI insight bar */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAIAction(retailer.insightType === 'opportunity' ? 'expand-presence' : 'fix-issues')
          }}
          className="bg-[#f8fafc] h-[38px] rounded-[12px] pl-[14px] pr-[10px] flex items-center gap-[8px] overflow-hidden shrink-0 w-full text-left hover:bg-[#f1f5f9] transition-colors group"
        >
          {retailer.insightType === 'opportunity'
            ? <Lightbulb size={13} className="text-[#16a34a] shrink-0" strokeWidth={2} />
            : <Sparkles size={13} className="text-[#6366f1] shrink-0" strokeWidth={2} />
          }
          <p className="flex-1 text-[12px] font-medium italic text-[#566166] font-inter leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
            "{retailer.insight}"
          </p>
          <ChevronDown size={12} className="text-[#94a3b8] shrink-0 -rotate-90 group-hover:text-[#6366f1] transition-colors" strokeWidth={2} />
        </button>

        {/* Footer */}
        <div className="border-t border-[#f1f5f9] pt-[14px] flex gap-[8px]">
          {retailer.actions.map((a) => (
            <button
              key={a.label}
              onClick={(e) => {
                e.stopPropagation()
                if (a.ai) onAIAction(a.label === 'Fix Issues' ? 'fix-issues' : a.label === 'Expand Presence' ? 'expand-presence' : 'deploy-plan')
              }}
              className={`flex-1 flex items-center justify-center gap-[5px] py-[7px] rounded-[10px] text-[12px] font-semibold font-inter transition-colors ${
                a.ai
                  ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5]'
                  : 'bg-[#f1f5f9] text-[#566166] hover:bg-[#e2e8f0]'
              }`}
            >
              {a.ai && <Sparkles size={11} strokeWidth={2} />}
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Retailer Detail Panel ────────────────────────────────────────────────────

function RetailerDetailPanel({
  retailer,
  onClose,
  onAIAction,
}: {
  retailer: Retailer
  onClose: () => void
  onAIAction: (key: string) => void
}) {
  const cfg = riskConfig[retailer.risk]

  return (
    <div className="w-[300px] shrink-0 border-l border-[#f1f5f9] bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`px-[20px] py-[14px] border-b border-[#f1f5f9] flex items-center justify-between shrink-0 ${cfg.bannerBg}`}>
        <div className="flex items-center gap-[8px]">
          <div className="size-[28px] rounded-[8px] bg-white/60 flex items-center justify-center">
            <span className="text-[12px] font-bold text-[#566166] font-heading">{retailer.logo}</span>
          </div>
          <div className="flex flex-col gap-[1px]">
            <span className="text-[13px] font-bold text-[#0f172a] font-inter">{retailer.name}</span>
            <span className={`text-[10px] font-bold tracking-[0.4px] font-inter ${cfg.bannerText}`}>{cfg.bannerLabel}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-[20px] py-[16px] flex flex-col gap-[20px]">

        {/* Regions */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide font-inter">Regions</span>
          {retailer.regions.map((r) => (
            <div key={r.name} className="flex items-center justify-between px-[12px] py-[9px] rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9]">
              <div className="flex items-center gap-[8px]">
                <MapPin size={12} className="text-[#94a3b8]" strokeWidth={2} />
                <span className="text-[12px] font-semibold text-[#0f172a] font-inter">{r.name}</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <span className="text-[13px]">{regionDot[r.status]}</span>
                <span className="text-[11px] font-medium text-[#64748b] font-inter capitalize">
                  {r.status === 'high' ? 'High OOS' : r.status === 'medium' ? 'Moderate' : 'Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Top issues */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide font-inter">Top Issues</span>
          {retailer.topIssues.map((issue) => (
            <div key={issue.sku} className="flex flex-col gap-[2px] px-[12px] py-[9px] rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9]">
              <span className="text-[12px] font-bold text-[#0f172a] font-inter">{issue.sku}</span>
              <span className="text-[11px] text-[#64748b] font-inter">{issue.detail}</span>
            </div>
          ))}
        </div>

        {/* AI recommendation */}
        <div className="flex flex-col gap-[8px] px-[14px] py-[12px] rounded-[12px] bg-[#f5f3ff] border border-[#e0e7ff]">
          <div className="flex items-center gap-[6px]">
            <Sparkles size={12} className="text-[#6366f1]" strokeWidth={2} />
            <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wide font-inter">AI Recommendation</span>
          </div>
          <p className="text-[12px] text-[#4338ca] font-inter leading-snug italic">
            "I recommend prioritizing {retailer.name} {retailer.regions.find(r => r.status === 'high')?.name ?? ''} region.
            Estimated recovery: {retailer.id === 1 ? '$8,200' : retailer.id === 2 ? '$3,100' : '$2,400'}."
          </p>
          <button
            onClick={() => onAIAction('deploy-plan')}
            className="flex items-center justify-center gap-[6px] px-[12px] py-[7px] rounded-[8px] bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
          >
            <Sparkles size={11} strokeWidth={2} />
            Execute Plan
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-[6px]">
          <button className="flex items-center justify-center gap-[6px] px-[12px] py-[8px] rounded-[10px] border border-[#e2e8f0] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
            <Store size={12} strokeWidth={2} />
            View Affected Stores
          </button>
          <button
            onClick={() => onAIAction('deploy-plan')}
            className="flex items-center justify-center gap-[6px] px-[12px] py-[8px] rounded-[10px] bg-[#0f172a] text-[12px] font-semibold text-white font-inter hover:bg-[#1e293b] transition-colors"
          >
            <Rocket size={12} strokeWidth={2} />
            Deploy Actions
          </button>
        </div>
      </div>

      {/* AI chat input */}
      <div className="px-[16px] py-[12px] border-t border-[#f1f5f9] shrink-0">
        <div className="flex items-center gap-[6px] px-[10px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]">
          <Bot size={13} className="text-[#6366f1] shrink-0" strokeWidth={2} />
          <input
            placeholder="Ask AI about this retailer…"
            className="flex-1 bg-transparent text-[12px] text-[#0f172a] font-inter placeholder:text-[#94a3b8] outline-none"
          />
          <button className="text-[#6366f1] hover:text-[#4f46e5] transition-colors shrink-0">
            <Send size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function FooterBar() {
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <SlidersHorizontal size={14} strokeWidth={2} />
        Bulk Actions
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Megaphone size={14} strokeWidth={2} />
        Create Campaign
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Download size={14} strokeWidth={2} />
        Export Report
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] bg-[#6366f1] text-white text-[13px] font-semibold font-inter hover:bg-[#4f46e5] transition-colors">
        <Sparkles size={14} strokeWidth={2} />
        AI Optimize
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Banners() {
  const [activeBrand, setActiveBrand] = useState('Saint Viviana')
  const [activeTab, setActiveTab] = useState('All Retailers')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [drawerKey, setDrawerKey] = useState<string | null>(null)
  const [drawerRetailer, setDrawerRetailer] = useState<Retailer | null>(null)

  const retailers = retailersByBrand[activeBrand]
  const summary = brandSummaryData[activeBrand]
  const visible = retailers.filter((r) => tabRisks[activeTab].includes(r.risk))
  const selected = retailers.find((r) => r.id === selectedId) ?? null

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header activeBrand={activeBrand} setActiveBrand={(b) => { setActiveBrand(b); setSelectedId(null) }} />
        <AISummaryBar summary={summary} />

        {/* White canvas */}
        <div className="flex flex-col flex-1 overflow-hidden rounded-b-xl bg-white">
          <FilterTabs active={activeTab} onChange={(t) => { setActiveTab(t); setSelectedId(null) }} />

          <div className="flex flex-1 min-h-0">
            {/* Cards grid */}
            <div className="flex-1 overflow-y-auto px-[32px] py-[24px] pb-[80px]">
              <div className={`grid gap-[16px] ${selected ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {visible.map((r) => (
                  <RetailerCard
                    key={r.id}
                    retailer={r}
                    selected={selectedId === r.id}
                    onSelect={() => setSelectedId(selectedId === r.id ? null : r.id)}
                    onAIAction={(key) => { setDrawerKey(key); setDrawerRetailer(r) }}
                  />
                ))}
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <RetailerDetailPanel
                retailer={selected}
                onClose={() => setSelectedId(null)}
                onAIAction={(key) => { setDrawerKey(key); setDrawerRetailer(selected) }}
              />
            )}
          </div>
        </div>
      </div>

      {/* AI Action Drawer */}
      {drawerKey && (
        <BannerAIDrawer
          actionKey={drawerKey}
          retailer={drawerRetailer}
          onClose={() => { setDrawerKey(null); setDrawerRetailer(null) }}
          onConfirm={() => { setDrawerKey(null); setDrawerRetailer(null) }}
        />
      )}

      <FooterBar />
    </div>
  )
}
