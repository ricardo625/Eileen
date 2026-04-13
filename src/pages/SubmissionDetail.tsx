import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Share2,
  Sparkles,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Wrench,
  Bot,
  CheckCircle2,
  Clock,
  Copy,
  FileDown,
  Download,
  Send,
  MapPin,
  Store,
  Tag,
  ChevronRight,
  Package,
  UserPlus,
  X,
  Check,
  UserCheck,
} from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'
import { AIActionDrawer, type DrawerAction } from '../components/AIActionDrawer'
import userAvatar from '../assets/avatar.png'

type OnAction = (a: DrawerAction) => void

// ─── Mock data ────────────────────────────────────────────────────────────────

const submissionData: Record<string, {
  id: string
  status: 'VALIDATED' | 'FAILED' | 'PARTIAL'
  storeName: string
  location: string
  retailer: string
  shelfImage: string
  criticalCount: number
  revenueImpact: string
  belowThresholdCount: number
  aiInsight: string
  skus: { name: string; status: 'out' | 'low' | 'healthy'; price: string; facings: number }[]
  insights: string[]
  actions: { title: string; steps: string[]; priority: 'high' | 'medium' | 'low' }[]
  timeline: { time: string; label: string; done: boolean }[]
}> = {
  '1': {
    id: '1',
    status: 'VALIDATED',
    storeName: 'Target Shorewood',
    location: 'Illinois, US',
    retailer: 'Target',
    shelfImage: '/shelf-1.png',
    criticalCount: 2,
    revenueImpact: '$1,200/wk',
    belowThresholdCount: 2,
    aiInsight: 'Cabernet Sauvignon is missing from shelf. Competitor present.',
    skus: [
      { name: 'Cabernet Sauvignon', status: 'out', price: '—', facings: 0 },
      { name: 'Sparkling Chardonnay', status: 'low', price: '$14.99', facings: 2 },
      { name: 'Rosé', status: 'healthy', price: '$12.99', facings: 5 },
    ],
    insights: [
      'Competitor (Brand X) occupying shelf space where Cab Sauv should be placed',
      'Missing SKU despite inventory signal — possible phantom inventory',
      'Chardonnay facing count dropped from 4 → 2 since last audit (3 days ago)',
    ],
    actions: [
      {
        title: 'Restock Cabernet Sauvignon',
        steps: ['Assign to distributor', 'Priority: High'],
        priority: 'high',
      },
      {
        title: 'Verify phantom inventory',
        steps: ['Deploy shopper check', 'Cross-reference warehouse data'],
        priority: 'medium',
      },
      {
        title: 'Recover shelf space',
        steps: ['Adjust placement', 'Merchandising correction'],
        priority: 'medium',
      },
    ],
    timeline: [
      { time: '2h ago', label: 'Submission received', done: true },
      { time: '1h ago', label: 'Issues detected by AI', done: true },
      { time: 'Now', label: 'Actions pending approval', done: false },
    ],
  },
  '2': {
    id: '2',
    status: 'FAILED',
    storeName: 'Urban Cellars Metro',
    location: 'New York, US',
    retailer: 'Whole Foods',
    shelfImage: '/shelf-2.png',
    criticalCount: 1,
    revenueImpact: '$600/wk',
    belowThresholdCount: 1,
    aiInsight: 'Image capture failed. Manual verification required.',
    skus: [
      { name: 'Merlot Reserve', status: 'out', price: '—', facings: 0 },
      { name: 'Pinot Grigio', status: 'healthy', price: '$11.99', facings: 4 },
    ],
    insights: [
      'Sensor failure resulted in incomplete image capture',
      'Merlot Reserve likely out of stock based on prior audit',
    ],
    actions: [
      {
        title: 'Manual store verification',
        steps: ['Deploy field agent', 'Confirm stock levels'],
        priority: 'high',
      },
    ],
    timeline: [
      { time: '4h ago', label: 'Submission received', done: true },
      { time: '3h ago', label: 'Capture failure detected', done: true },
      { time: 'Now', label: 'Manual review pending', done: false },
    ],
  },
  '3': {
    id: '3',
    status: 'PARTIAL',
    storeName: 'Downtown Spritz Hub',
    location: 'California, US',
    retailer: 'Kroger',
    shelfImage: '/shelf-3.png',
    criticalCount: 0,
    revenueImpact: '$300/wk',
    belowThresholdCount: 1,
    aiInsight: 'Seasonal stock check partially completed. Rosé facings low.',
    skus: [
      { name: 'Summer Rosé', status: 'low', price: '$13.99', facings: 1 },
      { name: 'Prosecco DOC', status: 'healthy', price: '$18.99', facings: 6 },
    ],
    insights: [
      'Rosé facing count at minimum threshold for seasonal demand',
      'Prosecco performing well — top seller in category',
    ],
    actions: [
      {
        title: 'Top up Rosé inventory',
        steps: ['Schedule delivery', 'Update planogram'],
        priority: 'medium',
      },
    ],
    timeline: [
      { time: '5h ago', label: 'Submission received', done: true },
      { time: '4h ago', label: 'Partial scan completed', done: true },
      { time: 'Now', label: 'Review in progress', done: false },
    ],
  },
}

const defaultSubmission = submissionData['1']

// ─── Status helpers ───────────────────────────────────────────────────────────

const skuStatusConfig = {
  out: {
    dot: 'bg-[#dc2626]',
    label: 'Out of Stock',
    pill: 'bg-[#fef2f2] text-[#dc2626]',
  },
  low: {
    dot: 'bg-[#ea580c]',
    label: 'Low Stock',
    pill: 'bg-[#fff7ed] text-[#ea580c]',
  },
  healthy: {
    dot: 'bg-[#16a34a]',
    label: 'Healthy',
    pill: 'bg-[#f0fdf4] text-[#16a34a]',
  },
}

const priorityConfig = {
  high: { label: 'HIGH', pill: 'bg-[#fef2f2] text-[#dc2626]' },
  medium: { label: 'MEDIUM', pill: 'bg-[#fff7ed] text-[#ea580c]' },
  low: { label: 'LOW', pill: 'bg-[#f0fdf4] text-[#16a34a]' },
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ storeName, location, retailer, onAction }: { storeName: string; location: string; retailer: string; onAction: OnAction }) {
  const navigate = useNavigate()
  return (
    <header className="h-[80px] flex items-center justify-between px-[32px] border-b border-[#f1f5f9] bg-white shrink-0">
      <div className="flex items-center gap-[16px]">
        <button
          onClick={() => navigate('/submissions')}
          className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px] border border-[#e2e8f0] text-[13px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shrink-0"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Back
        </button>
        <div className="w-px h-5 bg-[#e2e8f0]" />
        <div className="flex flex-col gap-[3px]">
          <div className="text-[22px] font-bold text-[#0f172a] font-heading leading-none">Store Insight</div>
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="flex items-center gap-[4px] text-[13px] font-semibold text-[#0f172a] font-inter">
              <Store size={11} strokeWidth={2} className="text-[#94a3b8]" />
              {storeName}
            </span>
            <span className="text-[#e2e8f0]">·</span>
            <span className="flex items-center gap-[4px] text-[13px] text-[#64748b] font-inter">
              <MapPin size={11} strokeWidth={2} />
              {location}
            </span>
            <span className="text-[#e2e8f0]">·</span>
            <span className="flex items-center gap-[4px] text-[13px] text-[#64748b] font-inter">
              <Tag size={11} strokeWidth={2} />
              {retailer}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Share2 size={13} strokeWidth={2} />
          Share
        </button>
        <button
          onClick={() => onAction({
            title: `AI Assist — ${storeName}`,
            subtitle: 'Full analysis · Store insight',
            description: `I've analyzed the full submission for ${storeName}. Here's my complete assessment with a prioritized action plan to resolve all detected issues.`,
            impact: [
              { label: 'Est. revenue recovered', value: '$1,200/wk', positive: true },
              { label: 'Issues to resolve', value: '2 critical' },
            ],
            steps: [
              { label: 'Notify distributor', detail: 'Send priority restock request for Cab Sauv' },
              { label: 'Deploy shopper', detail: 'Verify phantom inventory at store level' },
              { label: 'Recover shelf space', detail: 'Correct placement vs competitor product' },
            ],
            confirmLabel: 'Execute All Actions',
          })}
          className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shadow-sm"
        >
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

function AISummaryBar({
  criticalCount,
  revenueImpact,
  belowThresholdCount,
  insight,
  onAction,
}: {
  criticalCount: number
  revenueImpact: string
  belowThresholdCount: number
  insight: string
  onAction: OnAction
}) {
  return (
    <div className="bg-[#1e293b] px-[32px] py-[14px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[24px] flex-1 min-w-0">
        <div className="flex items-center gap-[6px] shrink-0">
          <AlertTriangle size={14} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">
            {criticalCount} critical issue{criticalCount !== 1 ? 's' : ''} detected
          </span>
        </div>
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <div className="flex items-center gap-[6px] shrink-0">
          <DollarSign size={14} className="text-[#4ade80]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">
            Est. <span className="text-white font-semibold">{revenueImpact}</span> lost
          </span>
        </div>
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <div className="flex items-center gap-[6px] shrink-0">
          <TrendingDown size={14} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">
            Stock below threshold for{' '}
            <span className="text-white font-semibold">{belowThresholdCount} SKU{belowThresholdCount !== 1 ? 's' : ''}</span>
          </span>
        </div>
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <span className="text-[13px] text-white/60 font-inter truncate min-w-0">"{insight}"</span>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        <button
          onClick={() => onAction({
            title: 'Fix All Critical Issues',
            subtitle: `AI suggestion · ${criticalCount} critical issue${criticalCount !== 1 ? 's' : ''}`,
            description: `I'll resolve all ${criticalCount} critical issue${criticalCount !== 1 ? 's' : ''} — restocking missing SKUs and clearing phantom inventory to recover ${revenueImpact} in lost revenue.`,
            impact: [
              { label: 'Revenue recovered', value: revenueImpact, positive: true },
              { label: 'SKUs resolved', value: `${belowThresholdCount} of ${belowThresholdCount}`, positive: true },
            ],
            steps: [
              { label: 'Alert distributor', detail: 'Send priority restock request for out-of-stock SKU' },
              { label: 'Deploy verification', detail: 'Dispatch shopper to confirm shelf status' },
              { label: 'Reclaim shelf space', detail: 'Remove competitor product, update planogram' },
            ],
            confirmLabel: 'Fix All Issues',
          })}
          className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-full bg-[#e9604b] text-[12px] font-semibold text-white font-inter hover:bg-[#d94f3a] transition-colors"
        >
          <Sparkles size={11} strokeWidth={2} />
          Fix All
        </button>
        <button
          onClick={() => onAction({
            title: 'Deploy Shelf Check',
            subtitle: 'Field verification · Live conditions',
            description: 'Dispatch a field agent to capture live shelf conditions and verify current SKU status across the full section.',
            impact: [
              { label: 'Verification time', value: '~2 hours' },
              { label: 'Coverage', value: 'Full shelf' },
            ],
            steps: [
              { label: 'Dispatch nearest shopper', detail: 'Assign to closest available field agent' },
              { label: 'Capture shelf photos', detail: 'Full section + SKU-level documentation' },
              { label: 'Submit verification report', detail: 'Auto-populate submission record' },
            ],
            confirmLabel: 'Deploy Check',
          })}
          className="px-[12px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors"
        >
          Deploy Check
        </button>
        <button
          onClick={() => onAction({
            title: 'Notify Distributor',
            subtitle: 'Urgent restock alert',
            description: 'Send an urgent restock notification to the distributor for the out-of-stock SKU — 0 facings with active revenue impact.',
            impact: [
              { label: 'Expected restock', value: '24–48 hrs' },
              { label: 'Revenue at stake', value: revenueImpact },
            ],
            steps: [
              { label: 'Compose urgent alert', detail: 'Priority: HIGH — out of stock' },
              { label: 'Send to distributor', detail: 'Via preferred notification channel' },
              { label: 'Log & track', detail: 'Monitor response and ETA in system' },
            ],
            confirmLabel: 'Send Notification',
          })}
          className="px-[12px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors"
        >
          Notify Distributor
        </button>
      </div>
    </div>
  )
}

// ─── Product Status Table ─────────────────────────────────────────────────────

function ProductTable({ skus, onAction }: { skus: { name: string; status: 'out' | 'low' | 'healthy'; price: string; facings: number }[]; onAction: OnAction }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm overflow-hidden">
      <div className="px-[20px] py-[14px] border-b border-[#f1f5f9] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Package size={14} className="text-[#e9604b]" strokeWidth={2} />
          <span className="text-[14px] font-bold text-[#0f172a] font-heading">Product Status</span>
        </div>
        <span className="text-[12px] text-[#94a3b8] font-inter">{skus.length} SKUs</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-[#f8fafc]">
            <th className="text-left text-[11px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide px-[20px] py-[10px]">SKU</th>
            <th className="text-left text-[11px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide px-[16px] py-[10px]">Status</th>
            <th className="text-left text-[11px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide px-[16px] py-[10px]">Price</th>
            <th className="text-left text-[11px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide px-[16px] py-[10px]">Facings</th>
            <th className="text-left text-[11px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide px-[16px] py-[10px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku, i) => {
            const cfg = skuStatusConfig[sku.status]
            return (
              <tr key={sku.name} className={`border-t border-[#f1f5f9] ${i % 2 === 0 ? '' : 'bg-[#fafafa]'} hover:bg-[#f8fafc] transition-colors`}>
                <td className="px-[20px] py-[13px]">
                  <span className="text-[13px] font-semibold text-[#0f172a] font-inter">{sku.name}</span>
                </td>
                <td className="px-[16px] py-[13px]">
                  <span className={`inline-flex items-center gap-[5px] px-[8px] py-[3px] rounded-full text-[11px] font-semibold ${cfg.pill} font-inter`}>
                    <span className={`size-[5px] rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </td>
                <td className="px-[16px] py-[13px]">
                  <span className="text-[13px] text-[#566166] font-inter">{sku.price}</span>
                </td>
                <td className="px-[16px] py-[13px]">
                  <span className={`text-[13px] font-semibold font-inter ${sku.facings === 0 ? 'text-[#dc2626]' : sku.facings <= 2 ? 'text-[#ea580c]' : 'text-[#16a34a]'}`}>
                    {sku.facings}
                  </span>
                </td>
                <td className="px-[16px] py-[13px]">
                  {sku.status === 'out' && (
                    <button
                      onClick={() => onAction({
                        title: `Fix: ${sku.name}`,
                        subtitle: 'Out of stock · 0 facings',
                        description: `${sku.name} is completely out of stock. I'll coordinate an urgent restock and reclaim the shelf space currently occupied by a competitor.`,
                        impact: [
                          { label: 'Facing target', value: '4–6 facings', positive: true },
                          { label: 'Est. revenue', value: '+$800/wk', positive: true },
                        ],
                        steps: [
                          { label: 'Alert distributor', detail: 'Emergency restock request — highest priority' },
                          { label: 'Verify warehouse stock', detail: 'Confirm units available for delivery' },
                          { label: 'Schedule priority delivery', detail: 'Coordinate timing with store manager' },
                        ],
                        confirmLabel: 'Fix This SKU',
                      })}
                      className="flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#e9604b] text-[11px] font-semibold text-white font-inter hover:bg-[#d94f3a] transition-colors"
                    >
                      <Sparkles size={10} strokeWidth={2} />
                      Fix
                    </button>
                  )}
                  {sku.status === 'low' && (
                    <button
                      onClick={() => onAction({
                        title: `Restock: ${sku.name}`,
                        subtitle: `Low stock · ${sku.facings} facing${sku.facings !== 1 ? 's' : ''}`,
                        description: `${sku.name} is below optimal facing count at ${sku.price}. I'll schedule a top-up delivery to reach the target level.`,
                        impact: [
                          { label: 'Facing increase', value: `${sku.facings} → 4`, positive: true },
                          { label: 'Revenue uplift', value: '+$400/wk', positive: true },
                        ],
                        steps: [
                          { label: 'Check warehouse availability', detail: 'Confirm units in stock for delivery' },
                          { label: 'Schedule top-up delivery', detail: 'Include in next distributor run' },
                          { label: 'Update planogram', detail: 'Set minimum facing count to 4' },
                        ],
                        confirmLabel: 'Restock',
                      })}
                      className="px-[10px] py-[4px] rounded-full border border-[#e2e8f0] text-[11px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors"
                    >
                      Restock
                    </button>
                  )}
                  {sku.status === 'healthy' && (
                    <span className="text-[#94a3b8] text-[12px] font-inter">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Insights Panel ───────────────────────────────────────────────────────────

function InsightsPanel({ insights }: { insights: string[] }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm p-[20px]">
      <div className="flex items-center gap-[8px] mb-[14px]">
        <Sparkles size={14} className="text-[#6366f1]" strokeWidth={2} />
        <span className="text-[14px] font-bold text-[#0f172a] font-heading">AI Insights</span>
      </div>
      <div className="flex flex-col gap-[10px]">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-[10px] p-[12px] bg-[#f8fafc] rounded-[10px]">
            <div className="size-[18px] rounded-full bg-[#6366f1]/10 flex items-center justify-center shrink-0 mt-[1px]">
              <ChevronRight size={10} className="text-[#6366f1]" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] text-[#475569] font-inter leading-[1.5]">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Actions Panel ────────────────────────────────────────────────────────────

function ActionsPanel({ actions, onAction }: { actions: { title: string; steps: string[]; priority: 'high' | 'medium' | 'low' }[]; onAction: OnAction }) {
  const [approved, setApproved] = useState<Record<number, boolean>>({})
  const [allApproved, setAllApproved] = useState(false)

  const handleApproveAll = () => {
    const all: Record<number, boolean> = {}
    actions.forEach((_, i) => { all[i] = true })
    setApproved(all)
    setAllApproved(true)
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm p-[20px]">
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-[8px]">
          <Wrench size={14} className="text-[#e9604b]" strokeWidth={2} />
          <span className="text-[14px] font-bold text-[#0f172a] font-heading">Auto-Generated Actions</span>
        </div>
        <span className="text-[11px] text-[#94a3b8] font-inter">{actions.length} actions</span>
      </div>

      <div className="flex flex-col gap-[10px] mb-[16px]">
        {actions.map((action, i) => {
          const pcfg = priorityConfig[action.priority]
          const isApproved = approved[i]
          return (
            <div
              key={i}
              className={`rounded-[12px] border p-[14px] transition-colors ${isApproved ? 'border-[#16a34a]/20 bg-[#f0fdf4]' : 'border-[#f1f5f9] bg-[#f8fafc]'}`}
            >
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex items-start gap-[10px] flex-1 min-w-0">
                  <div className={`size-[22px] rounded-full flex items-center justify-center shrink-0 mt-[1px] ${isApproved ? 'bg-[#16a34a]' : 'bg-[#e9604b]/10'}`}>
                    {isApproved
                      ? <Check size={11} className="text-white" strokeWidth={3} />
                      : <span className="text-[10px] font-bold text-[#e9604b] font-inter">{i + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[8px] mb-[6px]">
                      <span className={`text-[13px] font-semibold font-inter ${isApproved ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>
                        {action.title}
                      </span>
                      <span className={`px-[6px] py-[1px] rounded-full text-[10px] font-bold font-inter ${pcfg.pill}`}>
                        {pcfg.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                      {action.steps.map((step, j) => (
                        <div key={j} className="flex items-center gap-[6px]">
                          <span className="text-[#94a3b8]">→</span>
                          <span className="text-[12px] text-[#566166] font-inter">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setApproved(prev => ({ ...prev, [i]: !prev[i] }))}
                  className={`shrink-0 px-[10px] py-[4px] rounded-full text-[11px] font-semibold font-inter transition-colors ${
                    isApproved
                      ? 'bg-[#16a34a]/10 text-[#16a34a] hover:bg-[#fef2f2] hover:text-[#dc2626]'
                      : 'border border-[#e2e8f0] text-[#566166] hover:bg-[#f8fafc]'
                  }`}
                >
                  {isApproved ? 'Approved' : 'Approve'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          onClick={() => {
            handleApproveAll()
            onAction({
              title: 'Approve All Actions',
              subtitle: `${actions.length} actions pending · Auto-generated`,
              description: `Approve and immediately execute all ${actions.length} auto-generated action items for this submission.`,
              impact: [
                { label: 'Actions executed', value: `${actions.length} of ${actions.length}`, positive: true },
                { label: 'Est. impact', value: '$1,200/wk', positive: true },
              ],
              steps: actions.map(a => ({ label: a.title, detail: a.steps.join(' · ') })),
              confirmLabel: 'Approve All',
            })
          }}
          className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] bg-[#e9604b] text-[13px] font-semibold text-white font-inter hover:bg-[#d94f3a] transition-colors"
        >
          <Sparkles size={12} strokeWidth={2} />
          {allApproved ? 'All Approved' : 'Approve All'}
        </button>
        <button className="px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] text-[13px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
          Edit Actions
        </button>
      </div>
    </div>
  )
}

// ─── Notes Panel ─────────────────────────────────────────────────────────────

function NotesPanel() {
  const [note, setNote] = useState('')
  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm p-[20px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <UserPlus size={14} className="text-[#64748b]" strokeWidth={2} />
        <span className="text-[14px] font-bold text-[#0f172a] font-heading">Notes</span>
      </div>

      <div className="mb-[14px]">
        <p className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter mb-[8px]">Account Management</p>
        <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[10px] border border-dashed border-[#e2e8f0] text-[13px] text-[#94a3b8] font-inter hover:bg-[#f8fafc] hover:border-[#94a3b8] transition-colors w-full justify-center">
          <UserPlus size={13} strokeWidth={1.75} />
          Add distributor / division / owner
        </button>
      </div>

      <div>
        <p className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter mb-[8px]">Internal Notes</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add internal notes visible only to your team..."
          rows={3}
          className="w-full px-[12px] py-[10px] rounded-[10px] border border-[#e2e8f0] text-[13px] text-[#475569] font-inter placeholder:text-[#cbd5e1] resize-none focus:outline-none focus:border-[#6366f1] transition-colors bg-[#f8fafc]"
        />
      </div>
    </div>
  )
}

// ─── External Sharing ─────────────────────────────────────────────────────────

function SharingPanel({ storeName }: { storeName: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm p-[20px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <Share2 size={14} className="text-[#64748b]" strokeWidth={2} />
        <span className="text-[14px] font-bold text-[#0f172a] font-heading">External Sharing</span>
      </div>

      <p className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter mb-[10px]">Share Action Items</p>
      <div className="flex items-center gap-[8px] mb-[14px]">
        <button
          onClick={handleCopy}
          className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors"
        >
          {copied ? <CheckCircle2 size={12} className="text-[#16a34a]" strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
          <FileDown size={12} strokeWidth={2} />
          Export PDF
        </button>
        <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
          <Download size={12} strokeWidth={2} />
          Export CSV
        </button>
      </div>

      <div className="p-[12px] rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9]">
        <p className="text-[11px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide mb-[4px]">Preview</p>
        <p className="text-[13px] text-[#475569] font-inter">"{storeName} requires restock + shelf correction"</p>
      </div>
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({ events }: { events: { time: string; label: string; done: boolean }[] }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm p-[20px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <Clock size={14} className="text-[#64748b]" strokeWidth={2} />
        <span className="text-[14px] font-bold text-[#0f172a] font-heading">Recent Activity</span>
      </div>
      <div className="flex items-center gap-0">
        {events.map((event, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-[6px]">
              <div className={`size-[28px] rounded-full flex items-center justify-center ${event.done ? 'bg-[#e9604b]' : 'bg-[#f1f5f9] border-2 border-dashed border-[#e2e8f0]'}`}>
                {event.done
                  ? <CheckCircle2 size={13} className="text-white" strokeWidth={2.5} />
                  : <Clock size={12} className="text-[#94a3b8]" strokeWidth={2} />
                }
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-[#94a3b8] font-inter">{event.time}</p>
                <p className="text-[12px] font-medium text-[#475569] font-inter whitespace-nowrap">{event.label}</p>
              </div>
            </div>
            {i < events.length - 1 && (
              <div className={`flex-1 h-px mx-[8px] mt-[-20px] ${event.done ? 'bg-[#e9604b]/30' : 'bg-[#e2e8f0]'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AI Assistant Panel ───────────────────────────────────────────────────────

interface AIChatMessage {
  role: 'ai' | 'user'
  text: string
}

function AIAssistantPanel({ storeName, onAction }: { storeName: string; onAction: OnAction }) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'ai',
      text: `I've analyzed the submission for ${storeName}. I can execute all actions:\n• Notify distributor for Cabernet restock\n• Deploy shopper for phantom inventory check\n• Track resolution progress`,
    },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: `Got it. I'll handle "${userMsg}" — monitoring the situation and will update you when resolved.`,
        },
      ])
    }, 800)
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm flex flex-col h-full min-h-[480px] overflow-hidden">
      {/* Panel header */}
      <div className="px-[18px] py-[14px] border-b border-[#f1f5f9] flex items-center gap-[8px] shrink-0">
        <div className="size-[28px] rounded-full bg-[#6366f1]/10 flex items-center justify-center">
          <Bot size={14} className="text-[#6366f1]" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#0f172a] font-inter">AI Assistant</p>
          <p className="text-[11px] text-[#94a3b8] font-inter">Ready to execute</p>
        </div>
        <span className="ml-auto flex items-center gap-[4px] text-[10px] font-semibold text-[#16a34a] font-inter">
          <span className="size-[6px] rounded-full bg-[#16a34a] animate-pulse" />
          Live
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-[16px] py-[14px] flex flex-col gap-[10px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-[8px] items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="size-[24px] rounded-full bg-[#6366f1]/10 flex items-center justify-center shrink-0">
                <Bot size={11} className="text-[#6366f1]" strokeWidth={2} />
              </div>
            )}
            <div
              className={`max-w-[80%] px-[12px] py-[9px] rounded-[12px] text-[12px] font-inter leading-[1.5] whitespace-pre-line ${
                msg.role === 'ai'
                  ? 'bg-[#f8fafc] text-[#475569] rounded-bl-[4px]'
                  : 'bg-[#6366f1] text-white rounded-br-[4px]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Execute Plan CTA */}
      <div className="px-[16px] py-[12px] border-t border-[#f1f5f9] shrink-0">
        <button
          onClick={() => onAction({
            title: 'Execute Full Plan',
            subtitle: `AI recommendation · ${storeName}`,
            description: `I'll execute the complete action plan for ${storeName}: distributor notification, shopper deployment, and shelf recovery coordination.`,
            impact: [
              { label: 'Revenue recovered', value: '$1,200/wk', positive: true },
              { label: 'ETA to resolve', value: '24–48 hrs', positive: true },
            ],
            steps: [
              { label: 'Notify distributor for restock', detail: 'Cabernet Sauvignon — urgent priority' },
              { label: 'Deploy shopper check', detail: 'Phantom inventory verification' },
              { label: 'Track resolution progress', detail: 'Monitor and update timeline automatically' },
            ],
            confirmLabel: 'Execute Plan',
          })}
          className="w-full flex items-center justify-center gap-[6px] py-[9px] rounded-[10px] bg-[#e9604b] text-[13px] font-semibold text-white font-inter hover:bg-[#d94f3a] transition-colors mb-[8px]"
        >
          <Sparkles size={12} strokeWidth={2} />
          Execute Plan
        </button>
        <div className="flex items-center gap-[8px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ask AI anything..."
            className="flex-1 px-[12px] py-[8px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-inter text-[#475569] placeholder:text-[#cbd5e1] focus:outline-none focus:border-[#6366f1] transition-colors bg-[#f8fafc]"
          />
          <button
            onClick={handleSend}
            className="size-[32px] rounded-[8px] bg-[#6366f1] flex items-center justify-center hover:bg-[#4f46e5] transition-colors shrink-0"
          >
            <Send size={13} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Floating Action Bar ──────────────────────────────────────────────────────

function FloatingActionBar({ onAction, submission }: {
  onAction: OnAction
  submission: typeof defaultSubmission
}) {
  const { collapsed } = useSidebar()
  const offset = collapsed ? 36 : 128

  return (
    <div
      className="fixed bottom-[24px] left-1/2 -translate-x-1/2 flex items-center gap-[6px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.45)] z-30 transition-[margin] duration-200"
      style={{ marginLeft: offset }}
    >
      <div className="flex items-center gap-[6px] px-[12px] py-[8px]">
        <div className="size-[6px] rounded-full bg-[#fbbf24] animate-pulse" />
        <span className="text-[12px] font-medium text-white/50 font-inter whitespace-nowrap">Awaiting approval</span>
      </div>
      <div className="w-px h-[18px] bg-white/10" />
      <button
        onClick={() => onAction({
          title: `Assign — ${submission.storeName}`,
          subtitle: 'Submission unassigned · Action required',
          description: `Assign this submission to a team member for follow-up and resolution tracking. They'll be notified immediately.`,
          impact: [
            { label: 'Response time', value: '↓ 60%', positive: true },
            { label: 'Accountability', value: 'Tracked' },
          ],
          steps: [
            { label: 'Select assignee', detail: 'Choose from available team members' },
            { label: 'Set priority level', detail: 'High — 2 critical issues detected' },
            { label: 'Send notification', detail: 'Notify assignee via email / Slack' },
          ],
          confirmLabel: 'Assign',
        })}
        className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors"
      >
        <UserCheck size={14} strokeWidth={2} />
        Assign
      </button>
      <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Download size={14} strokeWidth={2} />
        Export
      </button>
      <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[14px] text-[#f87171] text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <X size={14} strokeWidth={2.5} />
        Close Issue
      </button>
      <button
        onClick={() => onAction({
          title: 'Approve All Actions',
          subtitle: `${submission.actions.length} actions pending · Auto-generated`,
          description: `Approve and immediately execute all ${submission.actions.length} auto-generated action items for ${submission.storeName}.`,
          impact: [
            { label: 'Actions executed', value: `${submission.actions.length} of ${submission.actions.length}`, positive: true },
            { label: 'Est. impact', value: submission.revenueImpact, positive: true },
          ],
          steps: submission.actions.map(a => ({ label: a.title, detail: a.steps.join(' · ') })),
          confirmLabel: 'Approve All',
        })}
        className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[14px] bg-[#e9604b] text-white text-[13px] font-semibold font-inter hover:bg-[#d94f3a] transition-colors"
      >
        <Sparkles size={14} strokeWidth={2} />
        Approve Actions
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>()
  const submission = (id && submissionData[id]) ?? defaultSubmission
  const [drawerAction, setDrawerAction] = useState<DrawerAction | null>(null)

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          storeName={submission.storeName}
          location={submission.location}
          retailer={submission.retailer}
          onAction={setDrawerAction}
        />

        <AISummaryBar
          criticalCount={submission.criticalCount}
          revenueImpact={submission.revenueImpact}
          belowThresholdCount={submission.belowThresholdCount}
          insight={submission.aiInsight}
          onAction={setDrawerAction}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-[24px] py-[24px] flex gap-[20px] min-h-full">
            {/* Left column */}
            <div className="flex flex-col gap-[16px] flex-1 min-w-0">
              {/* Shelf photo */}
              <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-sm overflow-hidden">
                <img
                  src={submission.shelfImage}
                  alt="Shelf photo"
                  className="w-full h-[220px] object-cover"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-[220px] bg-[#f8fafc] flex flex-col items-center justify-center gap-2">
                          <div class="text-[48px]">🍷</div>
                          <span class="text-[14px] font-semibold text-[#94a3b8] font-inter">Shelf photo</span>
                        </div>
                      `
                    }
                  }}
                />
              </div>

              <ProductTable skus={submission.skus} onAction={setDrawerAction} />
              <InsightsPanel insights={submission.insights} />
              <ActionsPanel actions={submission.actions} onAction={setDrawerAction} />
              <NotesPanel />
              <SharingPanel storeName={submission.storeName} />
              <Timeline events={submission.timeline} />
            </div>

            {/* Right column — AI panel */}
            <div className="w-[300px] shrink-0 flex flex-col">
              <div className="sticky top-[24px]">
                <AIAssistantPanel storeName={submission.storeName} onAction={setDrawerAction} />
              </div>
            </div>
          </div>
        </div>

        <FloatingActionBar onAction={setDrawerAction} submission={submission} />
      </div>

      <AIActionDrawer action={drawerAction} onClose={() => setDrawerAction(null)} />
    </div>
  )
}
