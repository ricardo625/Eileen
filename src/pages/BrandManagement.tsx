import { useState } from 'react'
import { AIActionDrawer, type DrawerAction } from '../components/AIActionDrawer'
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  AlertCircle,
  Layers,
  X,
  Upload,
  RefreshCw,
  Package,
  ToggleLeft,
  ToggleRight,
  User,
} from 'lucide-react'
import userAvatar from '../assets/avatar.png'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="h-[80px] flex items-center justify-between px-[32px] border-b border-[#f1f5f9] bg-white shrink-0">
      <div className="flex flex-col">
        <div className="flex items-center gap-[10px]">
          <div className="text-[24px] font-bold text-[#0f172a] font-heading leading-none">Products</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[8px]">
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Plus size={13} strokeWidth={2.5} />
          Add Product
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Upload size={13} strokeWidth={2} />
          Import CSV
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shadow-sm">
          <Sparkles size={13} strokeWidth={2} />
          Sync Data
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

// ─── AI Insight Bar ───────────────────────────────────────────────────────────

function AIInsightBar({ onFixIssues, onAutoFill }: { onFixIssues: () => void; onAutoFill: () => void }) {
  return (
    <div className="bg-[#1e293b] rounded-t-xl px-[32px] py-[13px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[6px]">
          <AlertTriangle size={13} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">3 SKUs missing data</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <TrendingDown size={13} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">2 SKUs at risk of low stock</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <Lightbulb size={13} className="text-[#818cf8]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">1 pricing anomaly detected</span>
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <button
          onClick={onFixIssues}
          className="px-[13px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors"
        >
          Fix Issues
        </button>
        <button
          onClick={onAutoFill}
          className="flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
        >
          <Sparkles size={11} strokeWidth={2} />
          Auto-Fill Missing Data
        </button>
      </div>
    </div>
  )
}

// ─── Filters ──────────────────────────────────────────────────────────────────

function FilterBar() {
  return (
    <div className="flex items-center gap-[10px] px-[32px] py-[14px] border-b border-[#f1f5f9] shrink-0">
      <div className="relative">
        <div className="w-[220px] bg-[#f1f5f9] rounded-full flex items-center pl-[36px] pr-[14px] py-[8px]">
          <span className="text-[13px] text-[#94a3b8] font-inter">Search products…</span>
        </div>
        <Search size={13} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#94a3b8]" strokeWidth={2} />
      </div>
      {(['Category', 'Status', 'Stock Risk'] as const).map((f) => (
        <button
          key={f}
          className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-full border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors"
        >
          {f}
          <ChevronDown size={11} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}

// ─── Product Table ────────────────────────────────────────────────────────────

type ProductStatus = 'healthy' | 'low-risk' | 'incomplete'

interface Product {
  id: number
  name: string
  variant: string
  category: string
  upc: string | null
  threshold: number | null
  status: ProductStatus
  description: string
  aiSuggestion: string
  suggestedThreshold: number | null
  missingFields: string[]
  image: string
}

const statusConfig: Record<ProductStatus, { dot: string; label: string; bg: string; text: string }> = {
  healthy: { dot: 'bg-[#16a34a]', label: 'Healthy', bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
  'low-risk': { dot: 'bg-[#ea580c]', label: 'Low Risk', bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]' },
  incomplete: { dot: 'bg-[#dc2626]', label: 'Incomplete', bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]' },
}

const products: Product[] = [
  {
    id: 1,
    name: 'Cabernet Sauvignon',
    variant: '750ml Bottle',
    category: 'Wine',
    upc: '085000123456',
    threshold: 12,
    status: 'healthy',
    description: 'Full-bodied red with notes of dark cherry, blackcurrant, and cedar.',
    aiSuggestion: 'Based on sales velocity at 3 key accounts, threshold should be raised to 14 units.',
    suggestedThreshold: 14,
    missingFields: [],
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Sparkling Chardonnay',
    variant: '750ml Bottle',
    category: 'Wine',
    upc: '085001234567',
    threshold: 10,
    status: 'low-risk',
    description: 'Crisp and refreshing sparkling with green apple and citrus finish.',
    aiSuggestion: 'Stock velocity is 35% above expected. Consider raising threshold to 16 units.',
    suggestedThreshold: 16,
    missingFields: [],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Rosé',
    variant: '750ml Bottle',
    category: 'Wine',
    upc: null,
    threshold: null,
    status: 'incomplete',
    description: '',
    aiSuggestion: 'Missing UPC and threshold. I can auto-fill based on similar SKUs in your catalog.',
    suggestedThreshold: 10,
    missingFields: ['UPC', 'Stock Threshold', 'Description'],
    image: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=200&h=200&fit=crop&auto=format',
  },
]

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-[6px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold font-inter ${cfg.bg} ${cfg.text}`}>
      <span className={`size-[5px] rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function ExpandedRow({ product, onClose, onAIAction }: { product: Product; onClose: () => void; onAIAction: (a: DrawerAction) => void }) {
  const [threshold, setThreshold] = useState(String(product.threshold ?? ''))
  const [reorder, setReorder] = useState(product.threshold !== null)

  return (
    <tr>
      <td colSpan={7} className="p-0">
        <div className="bg-[#f8fafc] border-t border-b border-[#f1f5f9] px-[32px] py-[20px]">
          <div className="flex gap-[24px]">
            {/* Product image */}
            <div className="w-[100px] h-[100px] rounded-[12px] overflow-hidden shrink-0 border border-[#e2e8f0]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex-1 grid grid-cols-3 gap-[24px]">
              {/* Col 1: product info */}
              <div className="flex flex-col gap-[10px]">
                <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Product Info</div>
                <div className="flex flex-col gap-[6px]">
                  {[
                    { label: 'Category', value: product.category },
                    { label: 'Variant', value: product.variant },
                    { label: 'UPC', value: product.upc ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-[8px]">
                      <span className="text-[11px] font-medium text-[#94a3b8] font-inter w-[64px] shrink-0">{label}</span>
                      <span className={`text-[12px] font-semibold font-inter ${value === '—' ? 'text-[#dc2626]' : 'text-[#2a3439]'}`}>{value}</span>
                    </div>
                  ))}
                </div>
                {product.description && (
                  <p className="text-[12px] text-[#566166] font-inter leading-[18px] mt-[4px]">{product.description}</p>
                )}
              </div>

              {/* Col 2: inventory settings */}
              <div className="flex flex-col gap-[10px]">
                <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Inventory Settings</div>
                <div className="flex flex-col gap-[12px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[12px] font-medium text-[#566166] font-inter">Stock Threshold</label>
                    <input
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-[120px] px-[10px] py-[6px] rounded-[8px] border border-[#e2e8f0] text-[13px] font-medium text-[#2a3439] font-inter bg-white focus:outline-none focus:border-[#e9604b] transition-colors"
                    />
                  </div>
                  <div className="flex items-center justify-between w-[200px]">
                    <span className="text-[12px] font-medium text-[#566166] font-inter">Reorder Trigger</span>
                    <button onClick={() => setReorder(!reorder)} className="transition-colors">
                      {reorder
                        ? <ToggleRight size={22} className="text-[#e9604b]" strokeWidth={2} />
                        : <ToggleLeft size={22} className="text-[#94a3b8]" strokeWidth={2} />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Col 3: AI suggestion + missing data */}
              <div className="flex flex-col gap-[10px]">
                <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">AI Suggestions</div>
                <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-[14px] flex flex-col gap-[10px]">
                  <div className="flex items-start gap-[8px]">
                    <Sparkles size={13} className="text-[#6366f1] shrink-0 mt-[1px]" strokeWidth={2} />
                    <p className="text-[12px] font-medium italic text-[#566166] font-inter leading-[18px]">
                      "{product.aiSuggestion}"
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (product.suggestedThreshold) setThreshold(String(product.suggestedThreshold))
                      onAIAction({
                        title: `Apply Suggestion: ${product.name}`,
                        subtitle: 'AI recommendation · Inventory optimization',
                        description: `"${product.aiSuggestion}" — I'll update the stock threshold and adjust reorder settings accordingly.`,
                        impact: [
                          { label: 'New threshold',    value: product.suggestedThreshold ? `${product.suggestedThreshold} units` : 'Optimized', positive: true },
                          { label: 'OOS prevention',   value: '~92%',  positive: true },
                          { label: 'SKU optimized',    value: product.name },
                          { label: 'Est. time',        value: 'Instant', positive: true },
                        ],
                        steps: [
                          { label: 'Update threshold',   detail: `Set stock threshold to ${product.suggestedThreshold ?? 'recommended'} units for ${product.name}.` },
                          { label: 'Enable reorder',     detail: 'Activate automatic reorder trigger at threshold level.' },
                          { label: 'Sync to campaigns',  detail: 'Push updated threshold to all active campaigns using this SKU.' },
                        ],
                        confirmLabel: 'Apply Suggestion',
                      })
                    }}
                    className="flex items-center justify-center gap-[6px] w-full py-[6px] rounded-[8px] bg-[#f0f0ff] text-[12px] font-semibold text-[#6366f1] font-inter hover:bg-[#e0e0ff] transition-colors"
                  >
                    <Sparkles size={11} strokeWidth={2} />
                    Apply Suggestion
                  </button>
                </div>

                {/* Missing data warning */}
                {product.missingFields.length > 0 && (
                  <div className="bg-[#fef2f2] rounded-[12px] border border-[#fecaca] p-[14px] flex flex-col gap-[10px]">
                    <div className="flex items-start gap-[7px]">
                      <AlertCircle size={13} className="text-[#dc2626] shrink-0 mt-[1px]" strokeWidth={2} />
                      <p className="text-[12px] font-medium text-[#dc2626] font-inter leading-[18px]">
                        Missing: {product.missingFields.join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-[8px]">
                      <button
                        onClick={() => onAIAction({
                          title: `Auto-Fill: ${product.name}`,
                          subtitle: `Missing data · ${product.missingFields.join(', ')}`,
                          description: `${product.name} is missing critical data: ${product.missingFields.join(', ')}. I'll auto-fill these fields by cross-referencing similar SKUs in your catalog and industry databases.`,
                          impact: [
                            { label: 'Fields filled',    value: `${product.missingFields.length} fields`, positive: true },
                            { label: 'Status change',    value: 'Incomplete → Healthy', positive: true },
                            { label: 'Data accuracy',    value: '~95%',  positive: true },
                            { label: 'Time saved',       value: '~10 min', positive: true },
                          ],
                          steps: [
                            ...product.missingFields.map(f => ({ label: `Fill ${f}`, detail: `AI auto-generates ${f} based on similar SKUs and catalog data.` })),
                            { label: 'Validate data',   detail: 'Cross-check filled fields against GS1 database for accuracy.' },
                            { label: 'Update record',   detail: `Save all updated fields for ${product.name} to your product catalog.` },
                          ],
                          confirmLabel: `Auto-Fill ${product.name}`,
                        })}
                        className="flex items-center gap-[5px] flex-1 justify-center py-[6px] rounded-[8px] bg-[#dc2626] text-[12px] font-semibold text-white font-inter hover:bg-[#b91c1c] transition-colors"
                      >
                        <Sparkles size={11} strokeWidth={2} />
                        Auto-Fill with AI
                      </button>
                      <button className="flex-1 py-[6px] rounded-[8px] bg-white border border-[#fecaca] text-[12px] font-semibold text-[#dc2626] font-inter hover:bg-[#fef2f2] transition-colors">
                        Edit Manually
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Close */}
            <button onClick={onClose} className="p-[6px] rounded-full hover:bg-[#e2e8f0] text-[#94a3b8] transition-colors self-start shrink-0">
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}

function ProductTable({ onSelect, onAIAction }: { onSelect: (p: Product) => void; onAIAction: (a: DrawerAction) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const toggle = (id: number) => setExpanded(expanded === id ? null : id)

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="border-b border-[#f1f5f9]">
            {['Product Name', 'Variant', 'Category', 'UPC', 'Threshold', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-[20px] py-[12px] text-left text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <>
              <tr
                key={product.id}
                onClick={() => { toggle(product.id); onSelect(product) }}
                className={`border-b border-[#f8fafc] cursor-pointer transition-colors ${
                  expanded === product.id ? 'bg-[#f8fafc]' : 'hover:bg-[#f8fafc]'
                }`}
              >
                {/* Product name */}
                <td className="px-[20px] py-[14px]">
                  <div className="flex items-center gap-[8px]">
                    <ChevronRight
                      size={13}
                      strokeWidth={2}
                      className={`text-[#94a3b8] transition-transform ${expanded === product.id ? 'rotate-90' : ''}`}
                    />
                    <span className="text-[14px] font-semibold text-[#2a3439] font-inter">{product.name}</span>
                  </div>
                </td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#566166] font-inter">{product.variant}</td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#566166] font-inter">{product.category}</td>
                <td className="px-[20px] py-[14px]">
                  <span className={`text-[13px] font-inter ${product.upc ? 'text-[#566166]' : 'text-[#dc2626] font-medium'}`}>
                    {product.upc ? `${product.upc.slice(0, 6)}…` : '—'}
                  </span>
                </td>
                <td className="px-[20px] py-[14px]">
                  <span className={`text-[13px] font-inter ${product.threshold !== null ? 'text-[#566166]' : 'text-[#dc2626] font-medium'}`}>
                    {product.threshold !== null ? `${product.threshold} units` : '—'}
                  </span>
                </td>
                <td className="px-[20px] py-[14px]">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-[20px] py-[14px]" onClick={(e) => e.stopPropagation()}>
                  {product.status === 'incomplete' ? (
                    <button
                      onClick={() => onAIAction({
                        title: `Fix: ${product.name}`,
                        subtitle: `Incomplete data · ${product.missingFields.join(', ')}`,
                        description: `${product.name} is missing ${product.missingFields.join(', ')}. I can auto-fill all missing fields using similar SKUs in your catalog to get this product to a healthy status.`,
                        impact: [
                          { label: 'Fields filled',  value: `${product.missingFields.length} fields`, positive: true },
                          { label: 'New status',     value: 'Healthy',    positive: true },
                          { label: 'Data accuracy',  value: '~95%',       positive: true },
                          { label: 'Time saved',     value: '~10 min',    positive: true },
                        ],
                        steps: [
                          ...product.missingFields.map(f => ({ label: `Auto-fill ${f}`, detail: `Generate ${f} from similar SKUs and catalog data.` })),
                          { label: 'Validate and save', detail: `Verify accuracy and update ${product.name} record in your product catalog.` },
                        ],
                        confirmLabel: `Fix ${product.name}`,
                      })}
                      className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
                    >
                      <Sparkles size={11} strokeWidth={2} />
                      Fix
                    </button>
                  ) : (
                    <button className="px-[10px] py-[5px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f1f5f9] transition-colors">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
              {expanded === product.id && (
                <ExpandedRow key={`exp-${product.id}`} product={product} onClose={() => setExpanded(null)} onAIAction={onAIAction} />
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── AI Assistant Panel ───────────────────────────────────────────────────────

function AIPanel({ product, onAIAction }: { product: Product | null; onAIAction: (a: DrawerAction) => void }) {
  return (
    <div className="w-[280px] shrink-0 bg-white border-l border-[#f1f5f9] flex flex-col">
      {/* Header */}
      <div className="px-[20px] py-[16px] border-b border-[#f1f5f9]">
        <div className="flex items-center gap-[7px]">
          <div className="size-[26px] rounded-full bg-[#6366f1]/10 flex items-center justify-center">
            <Sparkles size={13} className="text-[#6366f1]" strokeWidth={2} />
          </div>
          <span className="text-[14px] font-bold text-[#2a3439] font-heading">AI Assistant</span>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] px-[20px] py-[16px] flex-1">
        {/* Summary */}
        <div className="bg-[#f0f0ff] rounded-[12px] p-[14px]">
          <p className="text-[13px] font-medium text-[#3730a3] font-inter leading-[20px]">
            {product?.status === 'incomplete'
              ? `"${product.name}" is missing critical data. I can auto-fill UPC, threshold, and description based on similar SKUs.`
              : '3 products need your attention. I can fix missing data and optimize all thresholds automatically.'
            }
          </p>
        </div>

        {/* Issue list */}
        <div className="flex flex-col gap-[8px]">
          <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Open Issues</div>
          {[
            { label: 'Rosé — missing UPC + threshold', type: 'error' },
            { label: 'Sparkling Chardonnay — low stock risk', type: 'warning' },
            { label: 'Cabernet — threshold suboptimal', type: 'info' },
          ].map(({ label, type }) => (
            <div key={label} className={`flex items-center gap-[8px] px-[10px] py-[8px] rounded-[10px] ${
              type === 'error' ? 'bg-[#fef2f2]' : type === 'warning' ? 'bg-[#fff7ed]' : 'bg-[#eff6ff]'
            }`}>
              <div className={`size-[6px] rounded-full shrink-0 ${
                type === 'error' ? 'bg-[#dc2626]' : type === 'warning' ? 'bg-[#ea580c]' : 'bg-[#2563eb]'
              }`} />
              <span className={`text-[12px] font-medium font-inter leading-[16px] ${
                type === 'error' ? 'text-[#dc2626]' : type === 'warning' ? 'text-[#ea580c]' : 'text-[#2563eb]'
              }`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Fix all */}
        <button
          onClick={() => onAIAction({
            title: 'Fix All Product Issues',
            subtitle: 'AI fix · 3 SKUs need attention',
            description: product?.status === 'incomplete'
              ? `"${product.name}" is missing critical data. I can auto-fill it and also fix the 2 other SKUs at risk in one pass.`
              : '3 products need your attention — missing data and suboptimal thresholds. I can fix all of them automatically in one action.',
            impact: [
              { label: 'Products fixed',    value: '3 SKUs',    positive: true },
              { label: 'Fields auto-filled', value: '5 fields', positive: true },
              { label: 'OOS prevention',    value: '+40%',      positive: true },
              { label: 'Time saved',        value: '~30 min',   positive: true },
            ],
            steps: [
              { label: 'Auto-fill Rosé data',          detail: 'Generate UPC, threshold (10 units), and description for Rosé 750ml.' },
              { label: 'Raise Sparkling threshold',    detail: 'Increase Sparkling Chardonnay threshold from 10 to 16 units.' },
              { label: 'Optimize Cabernet threshold',  detail: 'Update Cabernet Sauvignon threshold from 12 to 14 units.' },
              { label: 'Enable reorder triggers',      detail: 'Activate auto-reorder for all 3 SKUs at their new thresholds.' },
              { label: 'Validate and save',            detail: 'Cross-check all changes and save to product catalog.' },
            ],
            confirmLabel: 'Fix All Issues',
          })}
          className="flex items-center justify-center gap-[7px] w-full py-[10px] rounded-[12px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors mt-auto"
        >
          <Sparkles size={13} strokeWidth={2} />
          Fix All Issues
        </button>
      </div>
    </div>
  )
}

// ─── Footer Action Bar ────────────────────────────────────────────────────────

function FooterBar({ onOptimizeAll }: { onOptimizeAll: () => void }) {
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Layers size={14} strokeWidth={2} />
        Bulk Edit
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Upload size={14} strokeWidth={2} />
        Bulk Upload
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-[#f87171] text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <X size={14} strokeWidth={2.5} />
        Delete
      </button>
      <button
        onClick={onOptimizeAll}
        className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] bg-[#6366f1] text-white text-[13px] font-semibold font-inter hover:bg-[#4f46e5] transition-colors"
      >
        <Sparkles size={14} strokeWidth={2} />
        Optimize All
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrandManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [drawerAction, setDrawerAction] = useState<DrawerAction | null>(null)

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header />

        {/* Content canvas */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <AIInsightBar
            onFixIssues={() => setDrawerAction({
              title: 'Fix All SKU Issues',
              subtitle: 'AI fix · 3 SKUs missing data, 2 at risk',
              description: 'I\'ve detected 3 SKUs with missing data, 2 at risk of low stock, and 1 pricing anomaly. I can resolve all of them automatically — auto-filling missing fields and optimizing thresholds.',
              impact: [
                { label: 'SKUs fixed',        value: '3 SKUs',    positive: true },
                { label: 'Fields auto-filled', value: '5 fields', positive: true },
                { label: 'Risk reduction',    value: '-60%',      positive: true },
                { label: 'Time saved',        value: '~30 min',   positive: true },
              ],
              steps: [
                { label: 'Fix Rosé missing data',        detail: 'Auto-fill UPC, threshold, and description from similar catalog SKUs.' },
                { label: 'Adjust Sparkling threshold',   detail: 'Raise Sparkling Chardonnay threshold to 16 units to prevent OOS.' },
                { label: 'Optimize Cabernet threshold',  detail: 'Update Cabernet threshold from 12 to 14 based on sales velocity.' },
                { label: 'Resolve pricing anomaly',      detail: 'Flag the pricing discrepancy and notify the relevant team.' },
                { label: 'Enable reorder triggers',      detail: 'Activate auto-reorder for all affected SKUs.' },
              ],
              confirmLabel: 'Fix All Issues',
            })}
            onAutoFill={() => setDrawerAction({
              title: 'Auto-Fill All Missing Data',
              subtitle: 'AI suggestion · 3 SKUs missing data',
              description: '3 SKUs have missing fields that are preventing them from reaching a healthy status. I\'ll auto-fill all missing data using similar SKUs from your catalog and GS1 database.',
              impact: [
                { label: 'SKUs updated',      value: '3 SKUs',    positive: true },
                { label: 'Fields filled',     value: '5 fields',  positive: true },
                { label: 'Accuracy est.',     value: '~95%',      positive: true },
                { label: 'Time saved',        value: '~20 min',   positive: true },
              ],
              steps: [
                { label: 'Fill Rosé UPC',            detail: 'Generate UPC by cross-referencing similar wine SKUs in your catalog.' },
                { label: 'Fill Rosé threshold',      detail: 'Set threshold to 10 units based on Rosé velocity from comparable brands.' },
                { label: 'Fill Rosé description',    detail: 'Auto-generate product description from wine category data.' },
                { label: 'Validate all fields',      detail: 'Cross-check against GS1 database for accuracy.' },
                { label: 'Update product catalog',   detail: 'Save all changes and mark affected SKUs as Healthy.' },
              ],
              confirmLabel: 'Auto-Fill All',
            })}
          />

          <div className="flex flex-col flex-1 bg-white overflow-hidden rounded-b-xl">
            <FilterBar />

            {/* Table + AI panel */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <ProductTable onSelect={setSelectedProduct} onAIAction={setDrawerAction} />
              <AIPanel product={selectedProduct} onAIAction={setDrawerAction} />
            </div>
          </div>
        </div>
      </div>

      <FooterBar onOptimizeAll={() => setDrawerAction({
        title: 'Optimize All Products',
        subtitle: 'AI optimization · Full catalog',
        description: 'I\'ll run a full optimization pass across all your products — adjusting thresholds based on current sales velocity, filling missing data, and enabling smart reorder triggers for every SKU.',
        impact: [
          { label: 'SKUs optimized',    value: '3 SKUs',    positive: true },
          { label: 'Threshold accuracy', value: '+35%',     positive: true },
          { label: 'OOS risk reduction', value: '-45%',     positive: true },
          { label: 'Time saved',        value: '~45 min',   positive: true },
        ],
        steps: [
          { label: 'Analyze sales velocity',   detail: 'Pull last 90 days of sales data for all 3 SKUs.' },
          { label: 'Optimize thresholds',       detail: 'Update Cabernet to 14, Sparkling to 16, Rosé to 10 units.' },
          { label: 'Fill missing fields',       detail: 'Auto-fill UPC, description, and threshold for Rosé 750ml.' },
          { label: 'Enable reorder triggers',   detail: 'Activate auto-reorder for all 3 SKUs at optimized levels.' },
          { label: 'Sync to active campaigns',  detail: 'Push updated thresholds to all campaigns using these SKUs.' },
        ],
        confirmLabel: 'Optimize All Products',
      })} />
      <AIActionDrawer action={drawerAction} onClose={() => setDrawerAction(null)} />
    </div>
  )
}
