import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { AIActionDrawer, type DrawerAction } from '../components/AIActionDrawer'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ArrowLeft,
  Download,
  Sparkles,
  AlertTriangle,
  DollarSign,
  MapPin,
  AlertCircle,
  TrendingUp,
  Eye,
  Wrench,
  ChevronUp,
  Store,
  X,
  Send,
  Bot,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'
import userAvatar from '../assets/avatar.png'

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const navigate = useNavigate()
  return (
    <header className="h-[80px] flex items-center justify-between px-[32px] border-b border-[#f1f5f9] bg-white shrink-0">
      <div className="flex items-center gap-[16px]">
        <button
          onClick={() => navigate('/campaign-hub')}
          className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px] border border-[#e2e8f0] text-[13px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Back
        </button>
        <div className="w-px h-5 bg-[#e2e8f0]" />
        <div className="flex flex-col gap-[3px]">
          <div className="text-[22px] font-bold text-[#0f172a] font-heading leading-none">Campaign Analytics</div>
          <div className="flex items-center gap-[8px]">
            <span className="text-[13px] font-medium text-[#64748b] font-inter">Campaign: Q1 Target Check</span>
            <span className="inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a] font-inter">
              <span className="size-[5px] rounded-full bg-[#16a34a]" />
              Active
            </span>
            <span className="flex items-center gap-[4px] text-[12px] text-[#94a3b8] font-inter">
              <Store size={11} strokeWidth={2} />
              300 Stores
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
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

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

function CampaignTabBar({ id }: { id: string }) {
  const tabs = [
    { label: 'Campaign Analytics',      to: `/campaign-hub/${id}/analytics` },
    { label: 'Campaign Configuration',  to: `/campaign-hub/${id}/configuration` },
  ]
  return (
    <div className="flex items-center gap-[4px] px-[32px] py-[12px] border-b border-[#f1f5f9] bg-white shrink-0">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `px-[16px] py-[6px] rounded-full text-[13px] font-semibold font-inter transition-colors ${
              isActive
                ? 'bg-[#0f172a] text-white'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}

// ─── AI Summary Bar ───────────────────────────────────────────────────────────

function AISummaryBar({ onFixIssues }: { onFixIssues: () => void }) {
  return (
    <div className="bg-[#1e293b] px-[32px] py-[12px] flex items-center justify-between gap-4 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-[24px] flex-wrap">
        <div className="flex items-center gap-[6px]">
          <AlertTriangle size={13} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">OOS increased +8% this week</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <DollarSign size={13} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">Est. $12,400 revenue at risk</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <MapPin size={13} className="text-[#818cf8]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">12 stores driving 60% of issues</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-[12px] text-white/60 font-inter italic">
          "2 SKUs are responsible for most stockouts in West region"
        </span>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        <button className="px-[13px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors">
          View Stores
        </button>
        <button
          onClick={onFixIssues}
          className="flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
        >
          <Sparkles size={11} strokeWidth={2} />
          Fix Issues
        </button>
      </div>
    </div>
  )
}

// ─── Key Metrics ──────────────────────────────────────────────────────────────

const keyMetrics = [
  { label: 'OOS Rate',    value: '22%', change: '+8%',  up: true,  color: '#dc2626', bg: '#fef2f2' },
  { label: 'Low Stock',   value: '15%', change: '+3%',  up: true,  color: '#ea580c', bg: '#fff7ed' },
  { label: 'Compliance',  value: '68%', change: '-4%',  up: false, color: '#ca8a04', bg: '#fefce8' },
  { label: 'Coverage',    value: '72%', change: '+2%',  up: false, color: '#16a34a', bg: '#f0fdf4' },
]

function KeyMetrics() {
  return (
    <div className="grid grid-cols-4 gap-[12px]">
      {keyMetrics.map((m) => (
        <div key={m.label} className="rounded-[14px] border border-[#e2e8f0] bg-white p-[18px] flex flex-col gap-[8px]">
          <div className="text-[12px] font-semibold text-[#94a3b8] font-inter uppercase tracking-wide">{m.label}</div>
          <div className="flex items-end gap-[8px]">
            <div className="text-[32px] font-bold text-[#0f172a] font-heading leading-none">{m.value}</div>
            <span
              className="flex items-center gap-[2px] text-[12px] font-semibold font-inter mb-[3px]"
              style={{ color: m.color }}
            >
              <ChevronUp
                size={12}
                strokeWidth={2.5}
                style={{ transform: m.up ? 'rotate(0deg)' : 'rotate(180deg)' }}
              />
              {m.change}
            </span>
          </div>
          <div className="h-[4px] rounded-full bg-[#f1f5f9] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: m.value, backgroundColor: m.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Priority Insights ────────────────────────────────────────────────────────

function InsightCard({
  dot,
  title,
  bullets,
  impact,
  confidence,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
}: {
  dot: string
  title: string
  bullets: string[]
  impact?: string
  confidence?: string
  primaryAction: { label: string; ai?: boolean }
  secondaryAction: { label: string }
  onPrimaryAction?: () => void
}) {
  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-[20px] flex flex-col gap-[14px]">
      <div className="flex items-center gap-[8px]">
        <span className="text-[18px]">{dot}</span>
        <span className="text-[14px] font-bold text-[#0f172a] font-heading">{title}</span>
      </div>

      <div className="flex flex-col gap-[5px]">
        {bullets.map((b) => (
          <div key={b} className="flex items-center gap-[7px]">
            <div className="size-[4px] rounded-full bg-[#94a3b8] shrink-0" />
            <span className="text-[13px] text-[#475569] font-inter">{b}</span>
          </div>
        ))}
      </div>

      {impact && (
        <div className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] bg-[#fff7ed] border border-[#fed7aa]">
          <DollarSign size={12} className="text-[#ea580c]" strokeWidth={2.5} />
          <span className="text-[12px] font-semibold text-[#ea580c] font-inter">Impact: {impact}</span>
        </div>
      )}

      {confidence && (
        <div className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] bg-[#f5f3ff] border border-[#e0e7ff]">
          <Sparkles size={12} className="text-[#6366f1]" strokeWidth={2} />
          <span className="text-[12px] font-semibold text-[#4338ca] font-inter">Confidence: {confidence}</span>
        </div>
      )}

      <div className="flex items-center gap-[6px] pt-[2px]">
        <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] bg-white text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          {secondaryAction.label}
        </button>
        <button
          onClick={onPrimaryAction}
          className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
        >
          {primaryAction.ai && <Sparkles size={11} strokeWidth={2} />}
          {primaryAction.label}
        </button>
      </div>
    </div>
  )
}

function PriorityInsights({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="text-[14px] font-bold text-[#0f172a] font-heading">Priority Insights</div>
      <div className="grid grid-cols-3 gap-[12px]">
        <InsightCard
          dot="🔴"
          title="High OOS Cluster — West Region"
          bullets={['12 stores affected', 'SKU: Cabernet Sauvignon']}
          impact="$8,200"
          primaryAction={{ label: 'Deploy Fix', ai: true }}
          secondaryAction={{ label: 'View Stores' }}
          onPrimaryAction={() => onAIAction({
            title: 'Deploy Fix: High OOS Cluster',
            subtitle: 'AI fix · West Region · 12 stores',
            description: 'I\'ve detected a high OOS cluster in the West region affecting 12 stores and Cabernet Sauvignon SKU. Deploying a fix will trigger restocks, assign field agents, and notify the regional distributor.',
            impact: [
              { label: 'Stores fixed',        value: '12 stores', positive: true },
              { label: 'Revenue recovered',   value: '$8,200',    positive: true },
              { label: 'Est. resolution time',value: '48 hrs',    positive: true },
              { label: 'SKUs at risk',         value: '1 SKU' },
            ],
            steps: [
              { label: 'Flag P1 stores',         detail: 'Mark 12 West region stores as P1 for same-day restock.' },
              { label: 'Trigger reorder',        detail: 'Auto-send reorder request for Cabernet Sauvignon to regional distributor.' },
              { label: 'Assign field agents',    detail: 'Deploy 2 field reps to highest-impact stores for verification.' },
              { label: 'Notify distributor',     detail: 'Send escalation alert to West region distributor with urgency flag.' },
              { label: 'Monitor resolution',     detail: 'Enable hourly OOS alerts for these 12 stores until resolved.' },
            ],
            confirmLabel: 'Deploy Fix',
          })}
        />
        <InsightCard
          dot="🟠"
          title="Pricing Variance Detected"
          bullets={['SKU priced +20% above competitors', '8 stores affected', 'Opportunity: Increase sales ~12%']}
          primaryAction={{ label: 'Recommend Adjustment', ai: true }}
          secondaryAction={{ label: 'View Details' }}
          onPrimaryAction={() => onAIAction({
            title: 'Recommend Pricing Adjustment',
            subtitle: 'AI suggestion · 8 stores · Pricing Audit',
            description: 'Pricing variance detected — your SKU is priced 20% above competitors in 8 stores. Correcting this could increase sales by ~12%. I\'ll generate a correction list and notify store managers.',
            impact: [
              { label: 'Stores updated',    value: '8 stores' },
              { label: 'Sales uplift est.', value: '+12%',     positive: true },
              { label: 'Compliance gain',   value: '+18%',     positive: true },
              { label: 'SKUs affected',     value: '1 SKU' },
            ],
            steps: [
              { label: 'Generate correction list', detail: 'Export store-level price correction sheet for field agents.' },
              { label: 'Notify store managers',    detail: 'Send automated pricing update request to 8 store managers.' },
              { label: 'Set compliance check',     detail: 'Schedule 48-hour follow-up to verify corrections applied.' },
              { label: 'Update audit log',         detail: 'Record variance and correction in campaign audit trail.' },
            ],
            confirmLabel: 'Apply Price Adjustments',
          })}
        />
        <InsightCard
          dot="🔵"
          title="Phantom Inventory Suspected"
          bullets={['Distributor shows stock', 'Shelf shows empty']}
          confidence="87%"
          primaryAction={{ label: 'Verify Stores', ai: true }}
          secondaryAction={{ label: 'View Evidence' }}
          onPrimaryAction={() => onAIAction({
            title: 'Verify Phantom Inventory',
            subtitle: 'AI analysis · 87% confidence',
            description: 'Distributor records show stock but shelves are empty — I\'ve flagged this as phantom inventory with 87% confidence. I\'ll deploy in-store verification and cross-reference with POS data to confirm.',
            impact: [
              { label: 'Stores to verify',  value: '4 stores' },
              { label: 'Confidence level',  value: '87%',      positive: true },
              { label: 'Est. stock gap',    value: '~200 units' },
              { label: 'Revenue at risk',   value: '$3,800' },
            ],
            steps: [
              { label: 'Cross-reference POS data',    detail: 'Compare distributor records with actual POS scans from the last 7 days.' },
              { label: 'Deploy store verification',   detail: 'Send field agents to the 4 suspected stores for shelf photo audit.' },
              { label: 'Flag distributor discrepancy',detail: 'Raise a formal discrepancy report with the distributor.' },
              { label: 'Update inventory records',    detail: 'Correct phantom stock entries in the inventory management system.' },
            ],
            confirmLabel: 'Verify Stores',
          })}
        />
      </div>
    </div>
  )
}

// ─── OOS Trend Chart ──────────────────────────────────────────────────────────

const trendData = [
  { label: 'W1', value: 14 },
  { label: 'W2', value: 16 },
  { label: 'W3', value: 13 },
  { label: 'W4', value: 17 },
  { label: 'W5', value: 19 },
  { label: 'W6', value: 22 },
]

function OOSTrendChart() {
  const max = 30
  const width = 480
  const height = 120
  const padX = 32
  const padY = 16
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const points = trendData.map((d, i) => ({
    x: padX + (i / (trendData.length - 1)) * chartW,
    y: padY + chartH - (d.value / max) * chartH,
    ...d,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`

  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-[20px] flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-bold text-[#0f172a] font-heading">OOS Trend Over Time</div>
        <div className="flex items-center gap-[5px] text-[11px] font-semibold text-[#dc2626] font-inter">
          <TrendingUp size={12} strokeWidth={2.5} />
          +8% this week
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 120 }}>
        <defs>
          <linearGradient id="oos-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX} y1={padY + chartH * t}
            x2={width - padX} y2={padY + chartH * t}
            stroke="#f1f5f9" strokeWidth="1"
          />
        ))}
        {/* Area */}
        <path d={areaD} fill="url(#oos-grad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="3.5" fill="#dc2626" stroke="white" strokeWidth="1.5" />
        ))}
        {/* Labels */}
        {points.map((p) => (
          <text key={`lbl-${p.label}`} x={p.x} y={height - 2} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Inter, sans-serif">
            {p.label}
          </text>
        ))}
        {/* Values */}
        {points.map((p) => (
          <text key={`val-${p.label}`} x={p.x} y={p.y - 7} textAnchor="middle" fontSize="10" fill="#dc2626" fontFamily="Inter, sans-serif" fontWeight="600">
            {p.value}%
          </text>
        ))}
      </svg>
    </div>
  )
}

// ─── Inventory Distribution Chart ─────────────────────────────────────────────

const inventorySegments = [
  { label: 'Good Stock', value: 63, color: '#16a34a' },
  { label: 'Low Stock',  value: 15, color: '#f59e0b' },
  { label: 'Out of Stock', value: 22, color: '#dc2626' },
]

function InventoryDonut() {
  const r = 44
  const cx = 60
  const cy = 60
  const circumference = 2 * Math.PI * r
  let offset = 0

  const arcs = inventorySegments.map((seg) => {
    const dash = (seg.value / 100) * circumference
    const arc = { ...seg, dashOffset: circumference - offset, dash }
    offset += dash
    return arc
  })

  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-[20px] flex flex-col gap-[12px]">
      <div className="text-[13px] font-bold text-[#0f172a] font-heading">Inventory Distribution</div>
      <div className="flex items-center gap-[20px]">
        <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth="16"
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="butt"
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">63%</text>
          <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Inter, sans-serif">Good</text>
        </svg>
        <div className="flex flex-col gap-[10px] flex-1">
          {inventorySegments.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-[7px]">
                <div className="size-[8px] rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[12px] font-medium text-[#475569] font-inter">{s.label}</span>
              </div>
              <span className="text-[13px] font-bold text-[#0f172a] font-inter">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Store Map ────────────────────────────────────────────────────────────────

type StoreStatus = 'oos' | 'low' | 'good'

const statusColor: Record<StoreStatus, { fill: string; label: string; bg: string; text: string }> = {
  oos:  { fill: '#dc2626', label: 'Out of Stock', bg: '#fef2f2', text: '#dc2626' },
  low:  { fill: '#f59e0b', label: 'Low Stock',    bg: '#fff7ed', text: '#ea580c' },
  good: { fill: '#16a34a', label: 'Good Stock',   bg: '#f0fdf4', text: '#16a34a' },
}

const sfStores: { name: string; address: string; impact: string; status: StoreStatus; lat: number; lng: number }[] = [
  { name: 'Target Mission',       address: '2800 Geary Blvd',         impact: '$1,200', status: 'oos',  lat: 37.7823, lng: -122.4538 },
  { name: 'Target SOMA',          address: '1690 Folsom St',          impact: '$980',   status: 'oos',  lat: 37.7697, lng: -122.4148 },
  { name: 'Target Sunset',        address: '2600 Irving St',          impact: '$740',   status: 'oos',  lat: 37.7639, lng: -122.4853 },
  { name: 'Target Marina',        address: '2055 Lombard St',         impact: '$510',   status: 'oos',  lat: 37.7993, lng: -122.4368 },
  { name: 'Target Castro',        address: '2700 Market St',          impact: '$430',   status: 'low',  lat: 37.7632, lng: -122.4356 },
  { name: 'Target Noe Valley',    address: '3801 24th St',            impact: '$390',   status: 'low',  lat: 37.7517, lng: -122.4313 },
  { name: 'Target Chinatown',     address: '838 Kearny St',           impact: '$310',   status: 'low',  lat: 37.7951, lng: -122.4064 },
  { name: 'Target Richmond',      address: '3251 20th Ave',           impact: '$270',   status: 'low',  lat: 37.7869, lng: -122.4746 },
  { name: 'Target FiDi',          address: '100 Pine St',             impact: '—',      status: 'good', lat: 37.7928, lng: -122.3987 },
  { name: 'Target Potrero Hill',  address: '1600 17th St',            impact: '—',      status: 'good', lat: 37.7644, lng: -122.3979 },
  { name: 'Target Excelsior',     address: '4650 Mission St',         impact: '—',      status: 'good', lat: 37.7219, lng: -122.4408 },
  { name: 'Target Hayes Valley',  address: '555 Fulton St',           impact: '—',      status: 'good', lat: 37.7774, lng: -122.4253 },
]

function StoreMap({ onDeployFix }: { onDeployFix: (action: DrawerAction) => void }) {
  const [selected, setSelected] = useState<typeof sfStores[0] | null>(null)

  const legend = [
    { status: 'oos'  as StoreStatus, label: 'Out of Stock' },
    { status: 'low'  as StoreStatus, label: 'Low Stock' },
    { status: 'good' as StoreStatus, label: 'Good Stock' },
  ]

  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f1f5f9] shrink-0">
        <div className="flex items-center gap-[8px]">
          <MapPin size={14} className="text-[#6366f1]" strokeWidth={2} />
          <span className="text-[13px] font-bold text-[#0f172a] font-heading">Store Coverage / Issues</span>
          <span className="text-[11px] font-medium text-[#94a3b8] font-inter">San Francisco, CA</span>
        </div>
        <div className="flex items-center gap-[14px]">
          {legend.map((l) => (
            <div key={l.status} className="flex items-center gap-[5px]">
              <div className="size-[8px] rounded-full" style={{ backgroundColor: statusColor[l.status].fill }} />
              <span className="text-[11px] text-[#64748b] font-inter">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map + detail panel side by side */}
      <div className="flex min-h-0" style={{ height: 340 }}>
        {/* Map */}
        <div className="flex-1 min-w-0">
          <MapContainer
            center={[37.773, -122.440]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sfStores.map((store) => {
              const cfg = statusColor[store.status]
              const isSelected = selected?.name === store.name
              return (
                <CircleMarker
                  key={store.name}
                  center={[store.lat, store.lng]}
                  radius={isSelected ? 12 : 8}
                  pathOptions={{
                    fillColor: cfg.fill,
                    color: isSelected ? '#0f172a' : 'white',
                    weight: isSelected ? 2.5 : 1.5,
                    fillOpacity: 0.9,
                  }}
                  eventHandlers={{ click: () => setSelected(store) }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 140 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{store.name}</div>
                      <div style={{ color: '#64748b', marginBottom: 6 }}>{store.address}</div>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: cfg.bg,
                        color: cfg.text,
                      }}>
                        {cfg.label}
                      </span>
                      {store.impact !== '—' && (
                        <div style={{ marginTop: 6, color: '#ea580c', fontWeight: 600 }}>Impact: {store.impact}</div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        {/* Detail panel */}
        <div className="w-[220px] shrink-0 border-l border-[#f1f5f9] flex flex-col overflow-y-auto">
          {selected ? (
            <div className="p-[16px] flex flex-col gap-[12px]">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[13px] font-bold text-[#0f172a] font-heading leading-snug">{selected.name}</div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[#94a3b8] hover:text-[#64748b] transition-colors shrink-0 mt-[1px]"
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>

              <div className="text-[11px] text-[#94a3b8] font-inter">{selected.address}</div>

              <span
                className="inline-flex items-center gap-[5px] px-[8px] py-[3px] rounded-full text-[11px] font-semibold font-inter self-start"
                style={{ backgroundColor: statusColor[selected.status].bg, color: statusColor[selected.status].text }}
              >
                <span className="size-[5px] rounded-full" style={{ backgroundColor: statusColor[selected.status].fill }} />
                {statusColor[selected.status].label}
              </span>

              {selected.impact !== '—' && (
                <div className="flex items-center gap-[6px] px-[10px] py-[7px] rounded-[8px] bg-[#fff7ed] border border-[#fed7aa]">
                  <DollarSign size={11} className="text-[#ea580c]" strokeWidth={2.5} />
                  <span className="text-[11px] font-semibold text-[#ea580c] font-inter">Impact: {selected.impact}</span>
                </div>
              )}

              <div className="flex flex-col gap-[6px] pt-[2px]">
                <button
                  onClick={() => onDeployFix({
                    title: `Fix ${selected.name}`,
                    subtitle: `AI suggestion · ${selected.name}`,
                    description: selected.status === 'oos'
                      ? `I've detected an out-of-stock issue at ${selected.name} (${selected.address}). This is causing an estimated ${selected.impact} revenue impact. I'll coordinate with the distributor and dispatch a field rep to resolve this immediately.`
                      : `Stock levels at ${selected.name} (${selected.address}) are running low. I'll proactively trigger a reorder and alert the field rep before this becomes a full out-of-stock event.`,
                    impact: [
                      { label: 'Store', value: selected.name },
                      { label: 'Revenue impact', value: selected.impact !== '—' ? selected.impact : 'Low', positive: false },
                      { label: 'Status', value: statusColor[selected.status].label },
                      { label: 'Est. resolution', value: '24–48h', positive: true },
                    ],
                    steps: selected.status === 'oos'
                      ? [
                          { label: 'Flag store as P1', detail: `Mark ${selected.name} as priority-1 for same-day restock.` },
                          { label: 'Trigger reorder', detail: 'Auto-send reorder request to regional distributor.' },
                          { label: 'Dispatch field rep', detail: 'Assign nearest field agent for on-site verification.' },
                          { label: 'Confirm restocked', detail: 'Photo audit required within 24h of completion.' },
                        ]
                      : [
                          { label: 'Send low-stock alert', detail: `Notify distributor of low inventory at ${selected.name}.` },
                          { label: 'Schedule replenishment', detail: 'Proactively schedule reorder before stockout occurs.' },
                          { label: 'Alert field rep', detail: 'Brief field rep for next scheduled visit.' },
                        ],
                    confirmLabel: 'Deploy Fix',
                  })}
                  className="flex items-center justify-center gap-[5px] px-[10px] py-[7px] rounded-[8px] bg-[#6366f1] text-[11px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
                >
                  <Sparkles size={10} strokeWidth={2} />
                  Deploy Fix
                </button>
                <button className="flex items-center justify-center gap-[5px] px-[10px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[11px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
                  View Full Detail
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-[0px] overflow-y-auto">
              <div className="px-[14px] py-[10px] border-b border-[#f1f5f9]">
                <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">
                  {sfStores.length} stores — click to inspect
                </span>
              </div>
              {sfStores.map((store) => {
                const cfg = statusColor[store.status]
                return (
                  <button
                    key={store.name}
                    onClick={() => setSelected(store)}
                    className="flex items-center gap-[8px] px-[14px] py-[9px] border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors text-left"
                  >
                    <div className="size-[7px] rounded-full shrink-0" style={{ backgroundColor: cfg.fill }} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-semibold text-[#0f172a] font-inter truncate">{store.name}</span>
                      {store.impact !== '—' && (
                        <span className="text-[10px] text-[#ea580c] font-inter font-medium">{store.impact}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Visual Analytics ─────────────────────────────────────────────────────────

function VisualAnalytics({ onDeployFix }: { onDeployFix: (action: DrawerAction) => void }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="text-[14px] font-bold text-[#0f172a] font-heading">Visual Analytics</div>
      <div className="grid grid-cols-2 gap-[12px]">
        <OOSTrendChart />
        <InventoryDonut />
      </div>
      <StoreMap onDeployFix={onDeployFix} />
    </div>
  )
}

// ─── Problem Stores Table ─────────────────────────────────────────────────────

const problemStores = [
  { name: 'Target Shorewood',   issue: 'OOS',       impact: '$1,200', issueColor: '#dc2626', issueBg: '#fef2f2' },
  { name: 'Target Albany',      issue: 'Low Stock',  impact: '$800',   issueColor: '#ea580c', issueBg: '#fff7ed' },
  { name: 'Target Mission Bay', issue: 'OOS',       impact: '$1,100', issueColor: '#dc2626', issueBg: '#fef2f2' },
  { name: 'Target Fremont',     issue: 'Phantom Inv', impact: '$950', issueColor: '#6366f1', issueBg: '#eef2ff' },
  { name: 'Target Oakland',     issue: 'OOS',       impact: '$740',   issueColor: '#dc2626', issueBg: '#fef2f2' },
]

function ProblemStoresTable({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="text-[14px] font-bold text-[#0f172a] font-heading">Top Problem Stores</div>
      <div className="rounded-[14px] border border-[#e2e8f0] bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
              <th className="text-left px-[20px] py-[11px] text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">Store Name</th>
              <th className="text-left px-[20px] py-[11px] text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">Issue</th>
              <th className="text-left px-[20px] py-[11px] text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">Impact</th>
              <th className="text-right px-[20px] py-[11px] text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">Action</th>
            </tr>
          </thead>
          <tbody>
            {problemStores.map((row, i) => (
              <tr key={row.name} className={`border-b border-[#f1f5f9] last:border-none ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                <td className="px-[20px] py-[12px]">
                  <div className="flex items-center gap-[8px]">
                    <Store size={13} className="text-[#94a3b8]" strokeWidth={1.75} />
                    <span className="text-[13px] font-semibold text-[#0f172a] font-inter">{row.name}</span>
                  </div>
                </td>
                <td className="px-[20px] py-[12px]">
                  <span
                    className="inline-block px-[8px] py-[2px] rounded-full text-[11px] font-semibold font-inter"
                    style={{ color: row.issueColor, backgroundColor: row.issueBg }}
                  >
                    {row.issue}
                  </span>
                </td>
                <td className="px-[20px] py-[12px]">
                  <div className="flex items-center gap-[4px]">
                    <DollarSign size={11} className="text-[#ea580c]" strokeWidth={2.5} />
                    <span className="text-[13px] font-semibold text-[#ea580c] font-inter">{row.impact}</span>
                  </div>
                </td>
                <td className="px-[20px] py-[12px] text-right">
                  <button
                    onClick={() => onAIAction({
                      title: `Fix: ${row.name}`,
                      subtitle: `${row.issue} · ${row.impact} at risk`,
                      description: `I've flagged ${row.name} for a ${row.issue} issue with ${row.impact} revenue at risk. I can deploy a field check, trigger a restock, and notify the store manager automatically.`,
                      impact: [
                        { label: 'Revenue at risk',  value: row.impact },
                        { label: 'Issue type',       value: row.issue },
                        { label: 'Est. fix time',    value: '24–48 hrs', positive: true },
                        { label: 'Field check',      value: '1 agent',   positive: true },
                      ],
                      steps: [
                        { label: 'Assign field agent',    detail: `Deploy a field rep to ${row.name} for same-day verification.` },
                        { label: 'Trigger restock alert', detail: `Send restock request to the store manager and distributor.` },
                        { label: 'Update campaign data',  detail: `Log the fix in the campaign audit trail with timestamp.` },
                        { label: 'Monitor resolution',    detail: `Enable daily check alerts until the issue is marked resolved.` },
                      ],
                      confirmLabel: `Fix ${row.name}`,
                    })}
                    className="inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-[7px] bg-[#6366f1] text-[11px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
                  >
                    <Sparkles size={10} strokeWidth={2} />
                    Fix
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── AI Assistant Panel ───────────────────────────────────────────────────────

function AIAssistantPanel({ onClose, onExecuteAll }: { onClose: () => void; onExecuteAll: () => void }) {
  const [input, setInput] = useState('')
  const messages = [
    {
      role: 'ai',
      text: "I can deploy checks to the 12 highest-risk stores and notify distributors automatically.",
    },
    {
      role: 'ai',
      text: "2 SKUs — Cabernet Sauvignon and Pinot Noir — account for 74% of West region stockouts.",
    },
  ]

  return (
    <div className="w-[280px] shrink-0 border-l border-[#f1f5f9] bg-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[#f1f5f9] shrink-0">
        <div className="flex items-center gap-[7px]">
          <Bot size={14} className="text-[#6366f1]" strokeWidth={2} />
          <span className="text-[13px] font-bold text-[#0f172a] font-inter">AI Assistant</span>
        </div>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[16px] py-[14px] flex flex-col gap-[10px]">
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-[8px]">
            <div className="size-[24px] rounded-full bg-[#6366f1] flex items-center justify-center shrink-0 mt-[1px]">
              <Sparkles size={11} className="text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 px-[10px] py-[8px] rounded-[10px] bg-[#f5f3ff] border border-[#e0e7ff]">
              <span className="text-[12px] text-[#4338ca] font-inter leading-snug">"{m.text}"</span>
            </div>
          </div>
        ))}

        <button
          onClick={onExecuteAll}
          className="flex items-center justify-center gap-[6px] mt-[4px] px-[14px] py-[9px] rounded-[10px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors w-full"
        >
          <Sparkles size={12} strokeWidth={2} />
          Execute All
        </button>

        {/* Suggested prompts */}
        <div className="flex flex-col gap-[6px] mt-[4px]">
          <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">Suggested</div>
          {[
            'Which SKUs need immediate replenishment?',
            'Show stores with >$1k revenue at risk',
            'Draft distributor notification',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-left px-[10px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[11px] text-[#475569] font-inter hover:bg-[#f8fafc] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="px-[16px] py-[12px] border-t border-[#f1f5f9] shrink-0">
        <div className="flex items-center gap-[6px] px-[10px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI…"
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

// ─── Footer Action Bar ────────────────────────────────────────────────────────

function FooterActionBar() {
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Wrench size={14} strokeWidth={2} />
        Deploy Actions
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <AlertCircle size={14} strokeWidth={2} />
        Create Follow-up Campaign
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

export default function CampaignAnalytics() {
  const [showAI, setShowAI] = useState(true)
  const [drawerAction, setDrawerAction] = useState<DrawerAction | null>(null)

  const executeAllAction: DrawerAction = {
    title: 'Execute All AI Recommendations',
    subtitle: 'AI assistant · 3 active recommendations',
    description: 'I can deploy checks to the 12 highest-risk stores, notify distributors, and correct the 2 SKUs driving most of the West region stockouts — all in one automated sequence.',
    impact: [
      { label: 'Stores covered',    value: '12 stores', positive: true },
      { label: 'Revenue protected', value: '$12,400',   positive: true },
      { label: 'SKUs resolved',     value: '2 SKUs',    positive: true },
      { label: 'Time saved',        value: '~3 hrs',    positive: true },
    ],
    steps: [
      { label: 'Deploy field checks',      detail: 'Send agents to 12 highest-risk stores for same-day verification.' },
      { label: 'Trigger restock alerts',   detail: 'Auto-send reorder requests for Cabernet Sauvignon and Pinot Noir.' },
      { label: 'Notify distributors',      detail: 'Escalate to West region distributor with priority flag.' },
      { label: 'Correct pricing variances',detail: 'Send correction list to 8 stores with pricing above approved levels.' },
      { label: 'Set monitoring triggers',  detail: 'Enable daily alerts for all affected stores until issues are resolved.' },
    ],
    confirmLabel: 'Execute All',
  }

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header />
        <CampaignTabBar id="1" />
        <AISummaryBar onFixIssues={() => setDrawerAction({
          title: 'Fix All Campaign Issues',
          subtitle: 'AI fix · Q1 Target Check campaign',
          description: 'OOS has increased +8% this week with $12,400 in revenue at risk. 12 stores are driving 60% of the issues — I can apply fixes across all of them automatically.',
          impact: [
            { label: 'Stores fixed',        value: '12 stores', positive: true },
            { label: 'Revenue protected',   value: '$12,400',   positive: true },
            { label: 'OOS reduction est.',  value: '-6%',       positive: true },
            { label: 'SKUs at risk',        value: '2 SKUs' },
          ],
          steps: [
            { label: 'Flag P1 stores',         detail: 'Mark 12 stores as highest priority for same-day restock.' },
            { label: 'Trigger reorder alerts', detail: 'Auto-send reorder requests for 2 critical SKUs.' },
            { label: 'Escalate to distributor',detail: 'Notify West region distributor of critical OOS spike.' },
            { label: 'Deploy field checks',    detail: 'Assign field agents to top 5 highest-revenue-impact stores.' },
            { label: 'Enable daily monitoring',detail: 'Set daily OOS alerts for all 12 stores until resolved.' },
          ],
          confirmLabel: 'Fix All Issues',
        })} />

        {/* White canvas */}
        <div className="flex flex-1 min-h-0 rounded-b-xl bg-white overflow-hidden">
          {/* Main scroll area */}
          <div className="flex-1 overflow-y-auto px-[32px] py-[24px] pb-[80px] flex flex-col gap-[24px]">
            <KeyMetrics />
            <PriorityInsights onAIAction={setDrawerAction} />
            <VisualAnalytics onDeployFix={setDrawerAction} />
            <ProblemStoresTable onAIAction={setDrawerAction} />
          </div>

          {/* Right AI panel */}
          {showAI && <AIAssistantPanel onClose={() => setShowAI(false)} onExecuteAll={() => setDrawerAction(executeAllAction)} />}

          {/* Toggle AI panel when closed */}
          {!showAI && (
            <button
              onClick={() => setShowAI(true)}
              className="fixed right-[20px] bottom-[80px] flex items-center gap-[6px] px-[14px] py-[9px] rounded-full bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shadow-lg z-20"
            >
              <Sparkles size={13} strokeWidth={2} />
              AI Assist
            </button>
          )}
        </div>
      </div>

      <FooterActionBar />
      <AIActionDrawer action={drawerAction} onClose={() => setDrawerAction(null)} />
    </div>
  )
}
