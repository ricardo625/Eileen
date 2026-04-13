import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle,
  Plus,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react'
import userAvatar from '../assets/avatar.png'
import Sidebar from '../components/Sidebar'
import { AIActionDrawer, type DrawerAction } from '../components/AIActionDrawer'
import { DarkModeToggle } from '../components/DarkModeToggle'

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="h-[80px] flex items-center justify-between px-[32px] shrink-0">
      <div className="flex flex-col">
        <div className="text-[24px] font-bold leading-[32px] text-[#0f172a] font-heading">The Shelf</div>
        <div className="text-[12px] font-medium leading-[16px] text-[#64748b] font-inter">
          AI-powered shelf intelligence across all stores
        </div>
      </div>
      <div className="flex items-center gap-[16px]">
        <button className="flex items-center gap-2 px-4 py-[9px] bg-white border border-[#e2e8f0] rounded-full text-[14px] font-medium text-[#566166] font-inter shadow-sm hover:bg-[#f8fafc] transition-colors">
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filters
          <ChevronDown size={14} strokeWidth={2} />
        </button>
        <div className="relative shrink-0">
          <div className="w-[256px] bg-[#eaf0f5] rounded-full flex items-center overflow-hidden pt-[9px] pb-[10px] pl-[40px] pr-[16px]">
            <span className="text-[14px] font-normal text-[#6b7280] font-inter leading-normal whitespace-nowrap">
              Search stores, SKUs…
            </span>
          </div>
          <Search size={15} className="absolute left-[14.5px] top-1/2 -translate-y-1/2 text-[#6b7280]" strokeWidth={2} />
        </div>
        <div className="flex items-center gap-[8px] pl-[8px]">
          <DarkModeToggle />
          <div className="size-[32px] rounded-full border-2 border-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[2px] overflow-hidden">
            <img src={userAvatar} alt="User avatar" className="size-[28px] rounded-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── AI Summary Bar ───────────────────────────────────────────────────────────

function AISummaryBar({ onAutoResolve }: { onAutoResolve: () => void }) {
  return (
    <div className="bg-[#1e293b] rounded-t-xl px-[32px] py-[14px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[24px] flex-1 min-w-0">
        <div className="flex items-center gap-[6px] shrink-0">
          <AlertTriangle size={14} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">
            12 issues detected across 48 stores
          </span>
        </div>
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <div className="flex items-center gap-[6px] shrink-0">
          <Flame size={14} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">
            5 high priority <span className="text-white/50">(revenue impact)</span>
          </span>
        </div>
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <div className="flex items-center gap-[6px] min-w-0">
          <ArrowRight size={14} className="text-[#818cf8] shrink-0" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter truncate">
            Focus: <span className="text-[#818cf8]">Target / West Coast / SKU: Cabernet</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        <button className="px-[14px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors">
          View All Issues
        </button>
        <button
          onClick={onAutoResolve}
          className="flex items-center gap-[6px] px-[14px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
        >
          <Sparkles size={12} strokeWidth={2} />
          Auto-Resolve Suggestions
        </button>
      </div>
    </div>
  )
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const filterTabs = ['All', 'Critical', 'Opportunities', 'Resolved', 'My Stores']

function FilterTabs({ active, onChange, counts }: { active: string; onChange: (t: string) => void; counts: Record<string, number> }) {
  return (
    <div className="flex items-center gap-[4px] px-[32px] py-[16px] border-b border-[#f1f5f9] bg-white shrink-0">
      {filterTabs.map((tab) => {
        const isActive = active === tab
        const count = counts[tab] ?? 0
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
              isActive
                ? 'bg-white/25 text-white'
                : 'bg-[#f1f5f9] text-[#94a3b8]'
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Action Cards ─────────────────────────────────────────────────────────────

type Severity = 'critical' | 'warning' | 'opportunity' | 'info' | 'resolved'

const severityConfig: Record<Severity, {
  dot: string; badge: string; badgeText: string; badgeBg: string; label: string
}> = {
  critical: {
    dot: 'bg-[#dc2626]',
    badge: 'bg-[#fef2f2] text-[#dc2626]',
    badgeText: 'OUT OF STOCK — HIGH IMPACT',
    badgeBg: 'bg-[#fef2f2]',
    label: 'CRITICAL',
  },
  warning: {
    dot: 'bg-[#ea580c]',
    badge: 'bg-[#fff7ed] text-[#ea580c]',
    badgeText: 'LOW STOCK — TRENDING DOWN',
    badgeBg: 'bg-[#fff7ed]',
    label: 'WARNING',
  },
  opportunity: {
    dot: 'bg-[#16a34a]',
    badge: 'bg-[#f0fdf4] text-[#16a34a]',
    badgeText: 'COMPETITOR GAP DETECTED',
    badgeBg: 'bg-[#f0fdf4]',
    label: 'OPPORTUNITY',
  },
  info: {
    dot: 'bg-[#2563eb]',
    badge: 'bg-[#eff6ff] text-[#2563eb]',
    badgeText: 'PHANTOM INVENTORY SUSPECTED',
    badgeBg: 'bg-[#eff6ff]',
    label: 'INFO',
  },
  resolved: {
    dot: 'bg-[#16a34a]',
    badge: 'bg-[#f0fdf4] text-[#16a34a]',
    badgeText: 'ISSUE RESOLVED',
    badgeBg: 'bg-[#f0fdf4]',
    label: 'RESOLVED',
  },
}

interface ActionCardProps {
  id: number
  severity: Severity
  store: string
  meta: { label: string; value: string }[]
  insight: string
  actions: string[]
  selected?: boolean
  onClick?: () => void
  onCTA?: (e: React.MouseEvent) => void
}

function ActionCard({
  severity,
  store,
  meta,
  insight,
  actions,
  selected,
  onClick,
  onCTA,
}: ActionCardProps) {
  const cfg = severityConfig[severity]
  const isResolved = severity === 'resolved'

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[20px] border overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] cursor-pointer transition-all ${
        selected ? 'border-[#e9604b]' : 'border-black/5 hover:border-black/10'
      }`}
    >
      {/* Severity banner */}
      <div className={`${cfg.badgeBg} h-[46px] pl-[20px] flex items-center gap-[8px] shrink-0`}>
        <div className={`size-[8px] rounded-full ${cfg.dot} shrink-0`} />
        <span className={`text-[11px] font-bold tracking-[0.5px] font-inter ${cfg.badge.split(' ')[1]}`}>
          {cfg.badgeText}
        </span>
      </div>

      {/* Body */}
      <div className="h-[375px] p-[20px] flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <div className="text-[16px] font-bold leading-[26.1px] text-[#2a3439] font-heading">{store}</div>
          <div className="flex flex-col gap-[3px]">
            {meta.map((m) => (
              <div key={m.label} className="h-[26px] flex items-center gap-[6px]">
                <span className="text-[12px] font-medium text-[#94a3b8] font-inter w-[56px] shrink-0">{m.label}</span>
                <span className="text-[12px] font-semibold text-[#566166] font-inter">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f8fafc] h-[38px] rounded-[12px] pl-[14px] pt-[10px] flex items-start gap-[8px] overflow-hidden shrink-0">
          <Sparkles size={13} className="text-[#6366f1] shrink-0" strokeWidth={2} />
          <p className="text-[12px] font-medium italic text-[#566166] font-inter leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
            "{insight}"
          </p>
        </div>

        <div className="flex flex-col gap-[4px] flex-1">
          {actions.map((action) => (
            <div key={action} className="h-[26px] flex items-center gap-[8px]">
              <ChevronRight size={12} className="text-[#94a3b8] shrink-0" strokeWidth={2.5} />
              <span className="text-[12px] font-medium text-[#566166] font-inter">{action}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#f1f5f9] pt-[17px] flex gap-[16px] items-center shrink-0">
          {isResolved ? (
            <>
              <button className="flex-1 py-[7px] rounded-[10px] bg-[#f0fdf4] text-[#16a34a] text-[12px] font-semibold font-inter hover:bg-[#dcfce7] transition-colors" onClick={(e) => e.stopPropagation()}>
                View Report
              </button>
              <button className="flex-1 py-[7px] rounded-[10px] bg-[#f1f5f9] text-[#566166] text-[12px] font-semibold font-inter hover:bg-[#e2e8f0] transition-colors" onClick={(e) => e.stopPropagation()}>
                Archive
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 py-[7px] rounded-[10px] bg-[#6366f1] text-white text-[12px] font-semibold font-inter hover:bg-[#4f46e5] transition-colors truncate px-[8px]" onClick={(e) => { e.stopPropagation(); onCTA?.(e) }}>
                {actions[0]}
              </button>
              <button className="flex-1 py-[7px] rounded-[10px] bg-[#f1f5f9] text-[#566166] text-[12px] font-semibold font-inter hover:bg-[#e2e8f0] transition-colors" onClick={(e) => e.stopPropagation()}>
                Dismiss
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Right Detail Panel ───────────────────────────────────────────────────────

type TimelineItem = { time: string; event: string; type: 'alert' | 'warning' | 'success' | 'info' }
type ActionItem = { label: string; done: boolean }

interface CardDetail {
  store: string
  sku: string
  stockHistory: { day: string; stock: number }[]
  timeline: TimelineItem[]
  relatedStores: string[]
  actionsTaken: ActionItem[]
}

const cardDetails: Record<number, CardDetail> = {
  1: {
    store: 'Target Shorewood',
    sku: 'Cabernet Sauvignon 750ml',
    stockHistory: [
      { day: '7d', stock: 80 }, { day: '6d', stock: 72 }, { day: '5d', stock: 65 },
      { day: '4d', stock: 58 }, { day: '3d', stock: 45 }, { day: '2d', stock: 20 },
      { day: '1d', stock: 8 }, { day: 'Now', stock: 0 },
    ],
    timeline: [
      { time: '2h ago', event: 'Out of stock detected by AI scan', type: 'alert' },
      { time: '1d ago', event: 'Stock at 2 units — low warning triggered', type: 'warning' },
      { time: '3d ago', event: 'Restock confirmed by field rep', type: 'success' },
      { time: '5d ago', event: 'Competitor Brand X added to adjacent shelf', type: 'info' },
    ],
    relatedStores: ['Target Orland Park', 'Target Evanston', 'Target Oak Park'],
    actionsTaken: [
      { label: 'Distributor notified', done: true },
      { label: 'Restock pending — ETA 24h', done: false },
    ],
  },
  2: {
    store: 'Chicago Lincoln Park Target',
    sku: 'Pinot Noir 750ml',
    stockHistory: [
      { day: '7d', stock: 60 }, { day: '6d', stock: 52 }, { day: '5d', stock: 40 },
      { day: '4d', stock: 28 }, { day: '3d', stock: 14 }, { day: '2d', stock: 5 },
      { day: '1d', stock: 2 }, { day: 'Now', stock: 0 },
    ],
    timeline: [
      { time: '5h ago', event: 'Full shelf gap detected — 6 facings empty', type: 'alert' },
      { time: '1d ago', event: 'Adjacent SKU encroachment flagged', type: 'warning' },
      { time: '2d ago', event: 'Last restock by field rep — 12 units', type: 'success' },
      { time: '4d ago', event: 'High velocity period — weekend promo active', type: 'info' },
    ],
    relatedStores: ['Chicago Hyde Park Target', 'Evanston Target', 'Chicago Loop Jewel'],
    actionsTaken: [
      { label: 'Emergency restock request filed', done: true },
      { label: 'Account manager notified', done: false },
      { label: 'Encroachment block — pending field visit', done: false },
    ],
  },
  3: {
    store: 'Albany Target',
    sku: 'Sparkling Chardonnay',
    stockHistory: [
      { day: '7d', stock: 95 }, { day: '6d', stock: 90 }, { day: '5d', stock: 82 },
      { day: '4d', stock: 70 }, { day: '3d', stock: 55 }, { day: '2d', stock: 38 },
      { day: '1d', stock: 22 }, { day: 'Now', stock: 12 },
    ],
    timeline: [
      { time: '1d ago', event: 'Velocity drop detected — 35% below regional avg', type: 'warning' },
      { time: '2d ago', event: 'Field rep last visit confirmed full stock', type: 'success' },
      { time: '4d ago', event: 'Seasonal promo ended — demand shift expected', type: 'info' },
      { time: '6d ago', event: 'New facing arrangement applied', type: 'info' },
    ],
    relatedStores: ['Albany Wegmans', 'Albany Walmart', 'Troy Target'],
    actionsTaken: [
      { label: 'Field rep alert sent', done: true },
      { label: 'Order volume review — pending', done: false },
    ],
  },
  4: {
    store: 'Miami Target',
    sku: 'Merlot Reserve 750ml',
    stockHistory: [
      { day: '7d', stock: 42 }, { day: '6d', stock: 42 }, { day: '5d', stock: 41 },
      { day: '4d', stock: 43 }, { day: '3d', stock: 40 }, { day: '2d', stock: 41 },
      { day: '1d', stock: 39 }, { day: 'Now', stock: 38 },
    ],
    timeline: [
      { time: '6h ago', event: 'Inventory discrepancy flagged by AI audit', type: 'alert' },
      { time: '1d ago', event: 'Distributor report: 38 units shipped', type: 'info' },
      { time: '2d ago', event: 'In-store scan: 0 units visible on shelf', type: 'warning' },
      { time: '4d ago', event: 'Last verified restock by field rep', type: 'success' },
    ],
    relatedStores: ['Miami Publix', 'Coral Gables Target', 'Doral Walmart'],
    actionsTaken: [
      { label: 'Shopper verification dispatched', done: false },
      { label: 'Distributor reconciliation — pending', done: false },
    ],
  },
  5: {
    store: 'Phoenix Target',
    sku: 'Cabernet Sauvignon 750ml',
    stockHistory: [
      { day: '7d', stock: 30 }, { day: '6d', stock: 30 }, { day: '5d', stock: 32 },
      { day: '4d', stock: 35 }, { day: '3d', stock: 40 }, { day: '2d', stock: 48 },
      { day: '1d', stock: 55 }, { day: 'Now', stock: 62 },
    ],
    timeline: [
      { time: '3h ago', event: 'Competitor SKU removed from adjacent shelf', type: 'success' },
      { time: '1d ago', event: 'Shelf space analysis flagged gap opportunity', type: 'info' },
      { time: '3d ago', event: 'Competitor promo ended', type: 'info' },
      { time: '5d ago', event: 'Brand share at 28% — below target', type: 'warning' },
    ],
    relatedStores: ["Phoenix Fry's", 'Scottsdale Target', 'Tempe Walmart'],
    actionsTaken: [
      { label: 'Expansion proposal drafted', done: true },
      { label: 'Promo materials — awaiting approval', done: false },
    ],
  },
  6: {
    store: 'Denver Walmart Supercenter',
    sku: 'Rosé 750ml',
    stockHistory: [
      { day: '7d', stock: 18 }, { day: '6d', stock: 20 }, { day: '5d', stock: 22 },
      { day: '4d', stock: 24 }, { day: '3d', stock: 25 }, { day: '2d', stock: 28 },
      { day: '1d', stock: 30 }, { day: 'Now', stock: 32 },
    ],
    timeline: [
      { time: '1h ago', event: 'End-cap slot identified as available', type: 'success' },
      { time: '6h ago', event: 'Previous occupant SKU removed by buyer', type: 'info' },
      { time: '2d ago', event: 'End-cap performance review completed', type: 'info' },
      { time: '4d ago', event: 'Category review scheduled for seasonal changeover', type: 'info' },
    ],
    relatedStores: ['Denver Costco', 'Aurora Walmart', 'Westminster Target'],
    actionsTaken: [
      { label: 'End-cap proposal submitted', done: false },
      { label: 'Display materials being prepared', done: false },
    ],
  },
  7: {
    store: 'Seattle Safeway Broadway',
    sku: 'Sparkling Chardonnay',
    stockHistory: [
      { day: '7d', stock: 14 }, { day: '6d', stock: 16 }, { day: '5d', stock: 18 },
      { day: '4d', stock: 20 }, { day: '3d', stock: 22 }, { day: '2d', stock: 26 },
      { day: '1d', stock: 30 }, { day: 'Now', stock: 34 },
    ],
    timeline: [
      { time: '4h ago', event: 'Competitor SKU delisted — 2 slots freed', type: 'success' },
      { time: '1d ago', event: 'Chilled section planogram review triggered', type: 'info' },
      { time: '3d ago', event: 'Competitor SKU velocity declined 60%', type: 'warning' },
      { time: '5d ago', event: 'Category manager flagged shelf underperformance', type: 'info' },
    ],
    relatedStores: ['Seattle QFC Capitol Hill', 'Bellevue Safeway', 'Kirkland Target'],
    actionsTaken: [
      { label: 'Facing expansion request sent to buyer', done: false },
      { label: 'Field rep briefed', done: false },
    ],
  },
  8: {
    store: 'Boston Prudential Target',
    sku: 'Merlot Reserve 750ml',
    stockHistory: [
      { day: '7d', stock: 0 }, { day: '6d', stock: 0 }, { day: '5d', stock: 0 },
      { day: '4d', stock: 12 }, { day: '3d', stock: 18 }, { day: '2d', stock: 22 },
      { day: '1d', stock: 26 }, { day: 'Now', stock: 30 },
    ],
    timeline: [
      { time: '2d ago', event: 'Full restock completed — 8 facings confirmed', type: 'success' },
      { time: '3d ago', event: 'Distributor delivery received — 30 units', type: 'success' },
      { time: '5d ago', event: 'Out of stock detected by AI scan', type: 'alert' },
      { time: '6d ago', event: 'Emergency restock request filed', type: 'info' },
    ],
    relatedStores: ['Boston Back Bay Target', 'Cambridge Target', 'Quincy Walmart'],
    actionsTaken: [
      { label: 'Restock completed and verified', done: true },
      { label: 'Photo audit submitted', done: true },
      { label: 'Issue marked resolved', done: true },
    ],
  },
  9: {
    store: 'Dallas Uptown Target',
    sku: 'Cabernet Sauvignon 750ml',
    stockHistory: [
      { day: '7d', stock: 28 }, { day: '6d', stock: 30 }, { day: '5d', stock: 32 },
      { day: '4d', stock: 34 }, { day: '3d', stock: 35 }, { day: '2d', stock: 36 },
      { day: '1d', stock: 38 }, { day: 'Now', stock: 38 },
    ],
    timeline: [
      { time: '1d ago', event: 'Price discrepancy corrected — shelf tag updated', type: 'success' },
      { time: '1d ago', event: 'POS system synced with corrected price', type: 'success' },
      { time: '2d ago', event: 'Pricing anomaly detected by AI — $2.50 gap', type: 'alert' },
      { time: '3d ago', event: 'Last pricing audit completed', type: 'info' },
    ],
    relatedStores: ['Dallas Highland Park Tom Thumb', 'Plano Target', 'Frisco Walmart'],
    actionsTaken: [
      { label: 'Shelf tag corrected', done: true },
      { label: 'POS sync confirmed', done: true },
      { label: 'Pricing audit logged', done: true },
    ],
  },
  10: {
    store: 'Austin Domain Target',
    sku: 'Pinot Grigio 750ml',
    stockHistory: [
      { day: '7d', stock: 20 }, { day: '6d', stock: 22 }, { day: '5d', stock: 25 },
      { day: '4d', stock: 28 }, { day: '3d', stock: 32 }, { day: '2d', stock: 36 },
      { day: '1d', stock: 40 }, { day: 'Now', stock: 44 },
    ],
    timeline: [
      { time: '3d ago', event: 'Shelf expansion completed — 5 facings confirmed', type: 'success' },
      { time: '4d ago', event: 'New planogram installed by field rep', type: 'success' },
      { time: '5d ago', event: 'Buyer approved expansion from 3 to 5 facings', type: 'success' },
      { time: '7d ago', event: 'Opportunity identified — competitor delisted', type: 'info' },
    ],
    relatedStores: ['Austin South Congress HEB', 'Cedar Park Target', 'Round Rock Walmart'],
    actionsTaken: [
      { label: 'Expansion approved and executed', done: true },
      { label: 'Planogram photo audit submitted', done: true },
      { label: 'Issue closed', done: true },
    ],
  },
}

const timelineColors: Record<string, string> = {
  alert: 'bg-[#dc2626]',
  warning: 'bg-[#ea580c]',
  success: 'bg-[#16a34a]',
  info: 'bg-[#2563eb]',
}

function DetailPanel({ detail, onClose }: { detail: CardDetail; onClose: () => void }) {

  return (
    <div className="w-[320px] shrink-0 bg-white border-l border-[#f1f5f9] flex flex-col overflow-y-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f1f5f9] sticky top-0 bg-white z-10">
        <div>
          <div className="text-[14px] font-bold text-[#2a3439] font-heading">{detail.store}</div>
          <div className="text-[11px] text-[#94a3b8] font-inter mt-[2px]">{detail.sku}</div>
        </div>
        <button onClick={onClose} className="p-[6px] rounded-full hover:bg-[#f1f5f9] text-[#94a3b8] transition-colors">
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-0 px-[20px] py-[16px] flex-1">
        {/* Timeline */}
        <div className="mb-[20px]">
          <div className="text-[11px] font-bold text-[#94a3b8] tracking-[0.5px] uppercase font-inter mb-[12px]">Timeline</div>
          <div className="flex flex-col gap-[12px]">
            {detail.timeline.map((item, i) => (
              <div key={i} className="flex gap-[10px]">
                <div className="flex flex-col items-center">
                  <div className={`size-[6px] rounded-full ${timelineColors[item.type]} shrink-0 mt-[5px]`} />
                  {i < detail.timeline.length - 1 && <div className="w-px flex-1 bg-[#f1f5f9] mt-[4px]" />}
                </div>
                <div className="pb-[12px]">
                  <div className="text-[12px] font-medium text-[#2a3439] font-inter leading-[16px]">{item.event}</div>
                  <div className="text-[11px] text-[#94a3b8] font-inter mt-[2px]">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related stores */}
        <div className="mb-[20px]">
          <div className="text-[11px] font-bold text-[#94a3b8] tracking-[0.5px] uppercase font-inter mb-[10px]">Related Stores</div>
          <div className="flex flex-col gap-[6px]">
            {detail.relatedStores.map((store) => (
              <div key={store} className="flex items-center justify-between py-[6px] px-[10px] rounded-[8px] bg-[#f8fafc]">
                <span className="text-[12px] font-medium text-[#566166] font-inter">{store}</span>
                <ChevronRight size={12} className="text-[#94a3b8]" strokeWidth={2} />
              </div>
            ))}
          </div>
        </div>

        {/* Stock history chart */}
        <div className="mb-[20px]">
          <div className="text-[11px] font-bold text-[#94a3b8] tracking-[0.5px] uppercase font-inter mb-[10px]">Stock History</div>
          <div className="bg-[#f8fafc] rounded-[12px] px-[4px] pt-[12px] pb-[4px]">
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={detail.stockHistory} margin={{ top: 0, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e9604b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e9604b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }} tickLine={false} axisLine={false} tickCount={3} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11, color: '#f8fafc', fontFamily: 'Inter, sans-serif', padding: '4px 10px' }}
                  itemStyle={{ color: '#e9604b' }}
                  formatter={(v: number) => [`${v} units`, 'Stock']}
                  cursor={{ stroke: '#e9604b', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="stock" stroke="#e9604b" strokeWidth={2} fill="url(#stockGrad)" dot={false} activeDot={{ r: 3, fill: '#e9604b', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actions taken */}
        <div>
          <div className="text-[11px] font-bold text-[#94a3b8] tracking-[0.5px] uppercase font-inter mb-[10px]">Actions Taken</div>
          <div className="flex flex-col gap-[6px]">
            {detail.actionsTaken.map((action, i) => (
              <div key={i} className={`flex items-center gap-[8px] py-[6px] px-[10px] rounded-[8px] ${action.done ? 'bg-[#f0fdf4]' : 'bg-[#f8fafc]'}`}>
                {action.done
                  ? <CheckCircle size={12} className="text-[#16a34a] shrink-0" strokeWidth={2} />
                  : <Clock size={12} className="text-[#94a3b8] shrink-0" strokeWidth={2} />
                }
                <span className={`text-[12px] font-medium font-inter ${action.done ? 'text-[#16a34a]' : 'text-[#566166]'}`}>{action.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const cards: ActionCardProps[] = [
  // ── All / Critical
  {
    id: 1,
    severity: 'critical',
    store: 'Target Shorewood',
    meta: [
      { label: 'SKU', value: 'Cabernet Sauvignon 750ml' },
      { label: 'Impact', value: 'Est. $2.3k/week lost' },
      { label: 'Detected', value: '2h ago' },
    ],
    insight: 'Product missing from shelf. Competitor (Brand X) occupying space.',
    actions: ['Restock immediately', 'Notify distributor', 'Validate shelf placement'],
  },
  {
    id: 2,
    severity: 'critical',
    store: 'Chicago Lincoln Park Target',
    meta: [
      { label: 'SKU', value: 'Pinot Noir 750ml' },
      { label: 'Impact', value: 'Est. $1.8k/week lost' },
      { label: 'Detected', value: '5h ago' },
    ],
    insight: 'Full shelf gap — 6 facings empty. Adjacent SKUs encroaching.',
    actions: ['Emergency restock request', 'Block adjacent encroachment', 'Flag account manager'],
  },
  // ── All / Warning
  {
    id: 3,
    severity: 'warning',
    store: 'Albany Target',
    meta: [
      { label: 'SKU', value: 'Sparkling Chardonnay' },
      { label: 'Impact', value: '-35% facings last 7 days' },
      { label: 'Detected', value: '1d ago' },
    ],
    insight: 'Stock decreasing faster than regional average. Intervention recommended within 48h.',
    actions: ['Increase order volume', 'Monitor next 48h', 'Alert field rep'],
  },
  // ── All / Info
  {
    id: 4,
    severity: 'info',
    store: 'Miami Target',
    meta: [
      { label: 'SKU', value: 'Merlot Reserve 750ml' },
      { label: 'Impact', value: 'Phantom stock — 87% confidence' },
      { label: 'Detected', value: '6h ago' },
    ],
    insight: 'Distributor data conflicts with in-store audit. Phantom inventory likely.',
    actions: ['Dispatch shopper verification'],
  },
  // ── Opportunities
  {
    id: 5,
    severity: 'opportunity',
    store: 'Phoenix Target',
    meta: [
      { label: 'SKU', value: 'Cabernet Sauvignon 750ml' },
      { label: 'Impact', value: '3 additional facings' },
      { label: 'Detected', value: '3h ago' },
    ],
    insight: 'Competitor removed from adjacent shelf. Prime opportunity to expand brand presence.',
    actions: ['Expand facings', 'Deploy promo materials', 'Notify field rep'],
  },
  {
    id: 6,
    severity: 'opportunity',
    store: 'Denver Walmart Supercenter',
    meta: [
      { label: 'SKU', value: 'Rosé 750ml' },
      { label: 'Impact', value: 'New end-cap available' },
      { label: 'Detected', value: '1h ago' },
    ],
    insight: 'High-traffic end-cap freed up. Seasonal rosé placement could lift velocity 40%.',
    actions: ['Submit end-cap proposal', 'Prepare display materials', 'Coordinate with buyer'],
  },
  {
    id: 7,
    severity: 'opportunity',
    store: 'Seattle Safeway Broadway',
    meta: [
      { label: 'SKU', value: 'Sparkling Chardonnay' },
      { label: 'Impact', value: '+2 facing slots open' },
      { label: 'Detected', value: '4h ago' },
    ],
    insight: 'Slow-moving competitor SKU delisted. Two facing slots now available in chilled section.',
    actions: ['Request facing expansion', 'Brief field rep', 'Update planogram'],
  },
  // ── Resolved
  {
    id: 8,
    severity: 'resolved',
    store: 'Boston Prudential Target',
    meta: [
      { label: 'SKU', value: 'Merlot Reserve 750ml' },
      { label: 'Impact', value: 'Restock completed' },
      { label: 'Resolved', value: '2d ago' },
    ],
    insight: 'Out-of-stock resolved. Field rep confirmed full 8-facing restock on 12/14.',
    actions: ['Restock completed by field rep', 'Distributor confirmed delivery', 'Shelf validated via photo'],
  },
  {
    id: 9,
    severity: 'resolved',
    store: 'Dallas Uptown Target',
    meta: [
      { label: 'SKU', value: 'Cabernet Sauvignon 750ml' },
      { label: 'Impact', value: 'Pricing corrected' },
      { label: 'Resolved', value: '1d ago' },
    ],
    insight: 'Price discrepancy of $2.50 between POS and shelf tag corrected after AI flagged anomaly.',
    actions: ['Price tag updated in-store', 'POS system synced', 'No further action needed'],
  },
  {
    id: 10,
    severity: 'resolved',
    store: 'Austin Domain Target',
    meta: [
      { label: 'SKU', value: 'Pinot Grigio 750ml' },
      { label: 'Impact', value: 'Shelf expansion done' },
      { label: 'Resolved', value: '3d ago' },
    ],
    insight: 'Opportunity actioned — brand now holds 5 facings in premium wine section, up from 3.',
    actions: ['Expansion approved by buyer', 'New planogram installed', 'Photo audit confirmed'],
  },
]

const tabSeverities: Record<string, Severity[]> = {
  'All':           ['critical', 'warning', 'opportunity', 'info', 'resolved'],
  'Critical':      ['critical'],
  'Opportunities': ['opportunity'],
  'Resolved':      ['resolved'],
  'My Stores':     ['critical', 'warning'],
}

export default function TheShelf() {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [drawerAction, setDrawerAction] = useState<DrawerAction | null>(null)

  const visibleCards = cards.filter(c => tabSeverities[activeTab].includes(c.severity))

  const tabCounts = Object.fromEntries(
    filterTabs.map(tab => [tab, cards.filter(c => tabSeverities[tab].includes(c.severity)).length])
  )

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header />
        <AISummaryBar onAutoResolve={() => setDrawerAction({
          title: 'Auto-Resolve All Shelf Issues',
          subtitle: 'AI suggestion · 12 issues across 48 stores',
          description: 'I\'ve identified 12 shelf issues across 48 stores — including 5 high-priority OOS events in the West Coast Target cluster. I can auto-resolve all of them by deploying field checks, triggering reorders, and notifying distributors.',
          impact: [
            { label: 'Issues resolved',   value: '12',      positive: true },
            { label: 'Revenue protected', value: '$14,200', positive: true },
            { label: 'Stores affected',   value: '48 stores' },
            { label: 'Time saved',        value: '~4 hrs',  positive: true },
          ],
          steps: [
            { label: 'Flag high-priority OOS stores',   detail: 'Mark 5 West Coast Target stores as P1 for same-day restock.' },
            { label: 'Trigger reorder alerts',          detail: 'Auto-send reorder requests for Cabernet Sauvignon across affected stores.' },
            { label: 'Deploy field checks',             detail: 'Assign 3 field agents to verify and restock the critical stores.' },
            { label: 'Notify distributors',             detail: 'Send automated escalation to West region distributor.' },
            { label: 'Set monitoring triggers',         detail: 'Enable daily shelf alerts for all 48 stores until issues are resolved.' },
          ],
          confirmLabel: 'Auto-Resolve All Issues',
        })} />

        {/* White content canvas */}
        <div className="flex flex-col flex-1 overflow-hidden rounded-b-xl bg-white">
          <FilterTabs active={activeTab} onChange={(t) => { setActiveTab(t); setSelectedId(null) }} counts={tabCounts} />

          {/* Feed + Panel */}
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-[32px] py-[24px]">
              <div className="grid grid-cols-2 gap-[16px]">
                {visibleCards.map((card) => (
                  <ActionCard
                    key={card.id}
                    {...card}
                    selected={selectedId === card.id}
                    onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
                    onCTA={() => setDrawerAction({
                      title: card.actions[0],
                      subtitle: `AI suggestion · ${card.store}`,
                      description: card.insight,
                      impact: card.meta.map((m) => ({
                        label: m.label,
                        value: m.value,
                        positive: card.severity === 'opportunity',
                      })),
                      steps: card.actions.map((action) => ({
                        label: action,
                        detail: `${action} at ${card.store}`,
                      })),
                      confirmLabel: card.actions[0],
                    })}
                  />
                ))}
              </div>
            </div>

            {/* Detail panel */}
            {selectedId !== null && cardDetails[selectedId] && (
              <DetailPanel detail={cardDetails[selectedId]} onClose={() => setSelectedId(null)} />
            )}
          </div>
        </div>

        {/* Floating action bar */}
        <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
          <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
            <Layers size={14} strokeWidth={2} />
            Bulk Edit
          </button>
          <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
            <Plus size={14} strokeWidth={2.5} />
            Bulk Upload
          </button>
          <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-[#f87171] text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
            <X size={14} strokeWidth={2.5} />
            Delete
          </button>
          <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] bg-[#6366f1] text-white text-[13px] font-semibold font-inter hover:bg-[#4f46e5] transition-colors">
            <Sparkles size={14} strokeWidth={2} />
            Optimize All
          </button>
        </div>
      </div>

      <AIActionDrawer action={drawerAction} onClose={() => setDrawerAction(null)} />
    </div>
  )
}
