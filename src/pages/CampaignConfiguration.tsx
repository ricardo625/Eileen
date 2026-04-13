import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { AIActionDrawer, type DrawerAction } from '../components/AIActionDrawer'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Plus,
  X,
  Save,
  Rocket,
  Store,
  Camera,
  Tag,
  DollarSign,
  LayoutGrid,
  Users,
  Smartphone,
  ChevronRight,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'
import userAvatar from '../assets/avatar.png'

// ─── Shared helpers ───────────────────────────────────────────────────────────

function AISuggestion({
  text,
  actionLabel,
  onAction,
}: {
  text: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-[10px] px-[14px] py-[10px] rounded-[10px] bg-[#f5f3ff] border border-[#e0e7ff]">
      <div className="flex items-start gap-[7px]">
        <Lightbulb size={13} className="text-[#6366f1] mt-[1px] shrink-0" strokeWidth={2} />
        <span className="text-[12px] text-[#4338ca] font-inter leading-snug italic">"{text}"</span>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[7px] bg-[#6366f1] text-[11px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shrink-0"
        >
          <Sparkles size={10} strokeWidth={2} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-[24px] flex flex-col gap-[16px]">
      <div className="text-[13px] font-bold text-[#0f172a] font-heading uppercase tracking-wide">{title}</div>
      {children}
    </div>
  )
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

function CampaignTabBar({ id }: { id: string }) {
  const tabs = [
    { label: 'Campaign Analytics',     to: `/campaign-hub/${id}/analytics` },
    { label: 'Campaign Configuration', to: `/campaign-hub/${id}/configuration` },
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
        <div className="flex flex-col gap-[2px]">
          <div className="text-[22px] font-bold text-[#0f172a] font-heading leading-none">Create Campaign</div>
          <div className="flex items-center gap-[6px]">
            {['Goal', 'Configuration', 'Targeting', 'Review'].map((step, i) => (
              <div key={step} className="flex items-center gap-[6px]">
                {i > 0 && <div className="w-[16px] h-px bg-[#e2e8f0]" />}
                <div className="flex items-center gap-[4px]">
                  <div className={`size-[16px] rounded-full flex items-center justify-center text-[9px] font-bold font-inter ${
                    i === 1
                      ? 'bg-[#0f172a] text-white'
                      : i < 1
                      ? 'bg-[#e9604b] text-white'
                      : 'bg-[#f1f5f9] text-[#94a3b8]'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-[11px] font-inter ${
                    i === 1 ? 'font-semibold text-[#0f172a]' : i < 1 ? 'font-medium text-[#e9604b]' : 'font-medium text-[#94a3b8]'
                  }`}>
                    {step}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Save size={13} strokeWidth={2} />
          Save Draft
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] bg-[#0f172a] text-[13px] font-semibold text-white font-inter hover:bg-[#1e293b] transition-colors shadow-sm">
          Next
          <ArrowRight size={13} strokeWidth={2} />
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

// ─── AI Assist Bar ────────────────────────────────────────────────────────────

function AIAssistBar({ onAutoConfigure }: { onAutoConfigure: () => void }) {
  return (
    <div className="bg-[#1e293b] px-[32px] py-[12px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[8px]">
        <Sparkles size={13} className="text-[#818cf8]" strokeWidth={2} />
        <span className="text-[13px] font-medium text-white/80 font-inter italic">
          "I can set this up for you based on recent gaps and performance."
        </span>
      </div>
      <button
        onClick={onAutoConfigure}
        className="flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shrink-0"
      >
        <Sparkles size={11} strokeWidth={2} />
        Auto-Configure
      </button>
    </div>
  )
}

// ─── Section 1: Campaign Goal ─────────────────────────────────────────────────

const campaignTypes = [
  { id: 'shelf',      label: 'Shelf Audit',          icon: LayoutGrid },
  { id: 'pricing',    label: 'Pricing Check',         icon: Tag },
  { id: 'competitor', label: 'Competitor Analysis',   icon: Users },
  { id: 'custom',     label: 'Custom',                icon: Sparkles },
]

function SectionGoal({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  const [selected, setSelected] = useState('shelf')
  const [objective, setObjective] = useState('')

  return (
    <SectionCard title="Campaign Goal">
      <div className="flex flex-col gap-[8px]">
        <label className="text-[12px] font-semibold text-[#566166] font-inter">Campaign Type</label>
        <div className="grid grid-cols-2 gap-[8px]">
          {campaignTypes.map((t) => {
            const Icon = t.icon
            const active = selected === t.id
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] border text-left transition-all ${
                  active
                    ? 'border-[#0f172a] bg-[#f8fafc]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                }`}
              >
                <div className={`size-[8px] rounded-full shrink-0 border-2 flex items-center justify-center ${
                  active ? 'border-[#0f172a]' : 'border-[#cbd5e1]'
                }`}>
                  {active && <div className="size-[3px] rounded-full bg-[#0f172a]" />}
                </div>
                <Icon size={13} className={active ? 'text-[#0f172a]' : 'text-[#94a3b8]'} strokeWidth={2} />
                <span className={`text-[12px] font-semibold font-inter ${active ? 'text-[#0f172a]' : 'text-[#64748b]'}`}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-[#566166] font-inter">Objective</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Describe the goal of this campaign…"
          rows={3}
          className="w-full px-[12px] py-[10px] rounded-[10px] border border-[#e2e8f0] text-[13px] text-[#0f172a] font-inter placeholder:text-[#94a3b8] outline-none focus:border-[#6366f1] transition-colors resize-none bg-[#f8fafc]"
        />
      </div>

      <AISuggestion
        text="Based on recent data, you should audit 12 Target stores with high OOS."
        actionLabel="Apply Suggestion"
        onAction={() => onAIAction({
          title: 'Apply Campaign Goal Suggestion',
          subtitle: 'AI suggestion · Based on recent OOS data',
          description: 'Based on recent performance, I recommend setting this campaign to audit 12 Target stores in the West region where OOS has been consistently high. I can auto-fill the goal, store selection, and SKU mapping.',
          impact: [
            { label: 'Stores targeted',      value: '12 stores', positive: true },
            { label: 'Est. revenue recovery', value: '$8,200',   positive: true },
            { label: 'Setup time saved',      value: '~20 min',  positive: true },
            { label: 'SKUs pre-mapped',       value: '2 SKUs',   positive: true },
          ],
          steps: [
            { label: 'Set campaign type',    detail: 'Configure as Shelf Audit targeting OOS and low stock issues.' },
            { label: 'Auto-fill objective',  detail: 'Set objective: Identify and resolve OOS in 12 Target West stores.' },
            { label: 'Select 12 stores',     detail: 'Pre-select stores with highest OOS rate from last 30 days.' },
            { label: 'Map 2 SKUs',           detail: 'Auto-map Cabernet Sauvignon and Sparkling Chardonnay.' },
          ],
          confirmLabel: 'Apply Suggestion',
        })}
      />
    </SectionCard>
  )
}

// ─── Section 2: Products / SKUs ───────────────────────────────────────────────

const defaultSkus = ['Cabernet Sauvignon 750ml', 'Sparkling Chardonnay']

function SectionProducts() {
  const [skus, setSkus] = useState(defaultSkus)

  return (
    <SectionCard title="Products (SKUs)">
      <div className="flex flex-col gap-[6px]">
        {skus.map((sku) => (
          <div key={sku} className="flex items-center justify-between gap-[8px] px-[12px] py-[8px] rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9]">
            <div className="flex items-center gap-[8px]">
              <div className="size-[6px] rounded-full bg-[#6366f1] shrink-0" />
              <span className="text-[13px] font-semibold text-[#0f172a] font-inter">{sku}</span>
            </div>
            <button onClick={() => setSkus(skus.filter((s) => s !== sku))} className="text-[#94a3b8] hover:text-[#64748b] transition-colors">
              <X size={13} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[8px]">
        <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
          <Plus size={12} strokeWidth={2.5} />
          Add Product
        </button>
        <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
          Edit Selection
        </button>
      </div>

      <AISuggestion text="These SKUs are driving 70% of recent issues." />
    </SectionCard>
  )
}

// ─── Section 3: Stores / Targeting ───────────────────────────────────────────

function SectionStores({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  return (
    <SectionCard title="Stores / Targeting">
      <div className="flex items-center gap-[10px] px-[16px] py-[12px] rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9]">
        <Store size={14} className="text-[#6366f1] shrink-0" strokeWidth={2} />
        <div className="flex flex-col gap-[1px]">
          <span className="text-[13px] font-bold text-[#0f172a] font-inter">120 stores selected</span>
          <span className="text-[11px] text-[#94a3b8] font-inter">Target — West Region</span>
        </div>
        <button className="ml-auto flex items-center gap-[5px] px-[10px] py-[5px] rounded-[7px] border border-[#e2e8f0] text-[11px] font-semibold text-[#566166] font-inter hover:bg-white transition-colors">
          Adjust Selection
        </button>
      </div>

      <div className="relative w-full h-[120px] rounded-[10px] bg-[#f1f5f9] overflow-hidden">
        <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full opacity-[0.15]" preserveAspectRatio="xMidYMid meet">
          <path d="M50,50 Q90,30 150,38 Q210,28 270,42 Q330,36 370,58 Q390,75 378,110 Q364,138 318,148 Q268,162 210,156 Q152,162 108,148 Q68,136 52,112 Q34,90 50,50Z" fill="#94a3b8" />
        </svg>
        {[
          { t: '28%', l: '20%', c: '#dc2626' }, { t: '45%', l: '26%', c: '#dc2626' },
          { t: '35%', l: '40%', c: '#f59e0b' }, { t: '55%', l: '50%', c: '#16a34a' },
          { t: '30%', l: '60%', c: '#16a34a' }, { t: '50%', l: '72%', c: '#f59e0b' },
          { t: '40%', l: '82%', c: '#16a34a' }, { t: '62%', l: '38%', c: '#dc2626' },
        ].map((d, i) => (
          <div key={i} className="absolute size-[7px] rounded-full border border-white shadow-sm" style={{ top: d.t, left: d.l, backgroundColor: d.c, transform: 'translate(-50%,-50%)' }} />
        ))}
      </div>

      <AISuggestion
        text="12 high-risk stores are not included in your current selection."
        actionLabel="Add Recommended"
        onAction={() => onAIAction({
          title: 'Add 12 Recommended Stores',
          subtitle: 'AI suggestion · High-risk stores not in selection',
          description: '12 high-risk stores are currently missing from your targeting. These stores have the highest OOS rates and should be included to maximize campaign coverage and revenue recovery.',
          impact: [
            { label: 'Stores added',         value: '12 stores', positive: true },
            { label: 'Coverage increase',     value: '+10%',      positive: true },
            { label: 'Additional revenue',    value: '$4,100',    positive: true },
            { label: 'New total stores',      value: '132 stores' },
          ],
          steps: [
            { label: 'Identify missing stores', detail: 'AI cross-references your current selection with high-OOS store list.' },
            { label: 'Add 12 stores',           detail: 'Auto-add 12 stores from West region with highest OOS severity.' },
            { label: 'Assign field agents',     detail: 'Allocate 2 additional agents to cover the expanded territory.' },
            { label: 'Update campaign budget',  detail: 'Recalculate estimated cost based on new store count.' },
          ],
          confirmLabel: 'Add 12 Stores',
        })}
      />
    </SectionCard>
  )
}

// ─── Section 4: Data to Capture ───────────────────────────────────────────────

const captureOptions = [
  { id: 'photo',      label: 'Shelf Photo',          icon: Camera,      default: true },
  { id: 'sku',        label: 'SKU Presence',         icon: Tag,         default: true },
  { id: 'price',      label: 'Price',                icon: DollarSign,  default: true },
  { id: 'facings',    label: 'Facings',              icon: LayoutGrid,  default: true },
  { id: 'competitor', label: 'Competitor Presence',  icon: Users,       default: false },
]

function SectionDataCapture({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(captureOptions.map((o) => [o.id, o.default]))
  )

  return (
    <SectionCard title="Data to Capture">
      <div className="flex flex-col gap-[6px]">
        {captureOptions.map((opt) => {
          const Icon = opt.icon
          const isChecked = checked[opt.id]
          return (
            <button
              key={opt.id}
              onClick={() => setChecked({ ...checked, [opt.id]: !isChecked })}
              className="flex items-center gap-[10px] px-[12px] py-[9px] rounded-[10px] border border-[#f1f5f9] hover:border-[#e2e8f0] transition-colors text-left"
            >
              <div className={`size-[16px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all ${
                isChecked ? 'bg-[#0f172a] border-[#0f172a]' : 'border-[#cbd5e1] bg-white'
              }`}>
                {isChecked && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <Icon size={13} className={isChecked ? 'text-[#0f172a]' : 'text-[#94a3b8]'} strokeWidth={2} />
              <span className={`text-[13px] font-semibold font-inter ${isChecked ? 'text-[#0f172a]' : 'text-[#94a3b8]'}`}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      <AISuggestion
        text="Enable competitor presence capture for better market insights."
        actionLabel="Enable"
        onAction={() => {
          setChecked({ ...checked, competitor: true })
          onAIAction({
            title: 'Enable Competitor Presence Capture',
            subtitle: 'AI suggestion · Data capture enhancement',
            description: 'Enabling competitor presence capture will give you market context alongside your shelf data. I\'ll add this data field to all shopper tasks in this campaign.',
            impact: [
              { label: 'New data points',   value: '1 field',   positive: true },
              { label: 'Market coverage',   value: '+100%',     positive: true },
              { label: 'Task time added',   value: '+30 sec' },
              { label: 'Insight value',     value: 'High',      positive: true },
            ],
            steps: [
              { label: 'Enable data field',     detail: 'Add "Competitor Presence" checkbox to the campaign data capture form.' },
              { label: 'Update instructions',   detail: 'Insert step in shopper instructions: record competitor facings.' },
              { label: 'Configure reporting',   detail: 'Add competitor presence column to the campaign analytics dashboard.' },
            ],
            confirmLabel: 'Enable Competitor Capture',
          })
        }}
      />
    </SectionCard>
  )
}

// ─── Section 5: Expectations / Rules ─────────────────────────────────────────

function SectionExpectations({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [threshold, setThreshold] = useState('')

  return (
    <SectionCard title="Expectations / Rules">
      <div className="flex flex-col gap-[10px]">
        <label className="text-[12px] font-semibold text-[#566166] font-inter">Price Range</label>
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[6px] flex-1 px-[12px] py-[9px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]">
            <span className="text-[12px] font-medium text-[#94a3b8] font-inter shrink-0">Min $</span>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-[13px] font-semibold text-[#0f172a] font-inter outline-none placeholder:text-[#cbd5e1]"
            />
          </div>
          <div className="w-[12px] h-px bg-[#e2e8f0] shrink-0" />
          <div className="flex items-center gap-[6px] flex-1 px-[12px] py-[9px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]">
            <span className="text-[12px] font-medium text-[#94a3b8] font-inter shrink-0">Max $</span>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-[13px] font-semibold text-[#0f172a] font-inter outline-none placeholder:text-[#cbd5e1]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[12px] font-semibold text-[#566166] font-inter">Stock Threshold</label>
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[6px] px-[12px] py-[9px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] flex-1">
            <input
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g. 14"
              className="flex-1 bg-transparent text-[13px] font-semibold text-[#0f172a] font-inter outline-none placeholder:text-[#cbd5e1]"
            />
            <span className="text-[12px] font-medium text-[#94a3b8] font-inter shrink-0">units</span>
          </div>
        </div>
      </div>

      <AISuggestion
        text="Set threshold to 14 units based on average product velocity."
        actionLabel="Apply"
        onAction={() => {
          setThreshold('14')
          onAIAction({
            title: 'Apply Threshold Recommendation',
            subtitle: 'AI suggestion · Based on average product velocity',
            description: 'Based on historical sales velocity for your selected SKUs, I recommend setting the stock threshold to 14 units. This prevents OOS events while avoiding overstocking costs.',
            impact: [
              { label: 'Recommended threshold', value: '14 units', positive: true },
              { label: 'OOS prevention rate',   value: '~92%',     positive: true },
              { label: 'Based on',              value: '90 days data' },
              { label: 'SKUs optimized',        value: '2 SKUs',   positive: true },
            ],
            steps: [
              { label: 'Set threshold to 14', detail: 'Apply 14-unit minimum stock threshold across all targeted stores.' },
              { label: 'Calibrate alerts',    detail: 'Configure low-stock alerts to trigger at 16 units (2-unit buffer).' },
              { label: 'Review in 30 days',   detail: 'Schedule automatic threshold review based on next 30 days of velocity data.' },
            ],
            confirmLabel: 'Apply Threshold',
          })
        }}
      />
    </SectionCard>
  )
}

// ─── Section 6: Shopper Instructions ─────────────────────────────────────────

const defaultInstructions = [
  'Go to the wine aisle',
  'Find Cabernet Sauvignon',
  'Take a clear photo of the shelf',
  'Confirm price and stock level',
]

function SectionShopperInstructions({ onAIAction }: { onAIAction: (a: DrawerAction) => void }) {
  const [instructions] = useState(defaultInstructions)

  return (
    <SectionCard title="Shopper Instructions (Preview)">
      <div className="flex gap-[20px]">
        {/* Mobile preview frame */}
        <div className="shrink-0 w-[140px] h-[240px] rounded-[20px] border-[6px] border-[#1e293b] bg-white shadow-lg overflow-hidden flex flex-col">
          <div className="h-[20px] bg-[#1e293b] flex items-center justify-center shrink-0">
            <div className="w-[40px] h-[4px] rounded-full bg-white/30" />
          </div>
          <div className="flex-1 bg-[#f8fafc] p-[8px] flex flex-col gap-[5px] overflow-hidden">
            <div className="text-[7px] font-bold text-[#0f172a] font-inter">Mission Instructions</div>
            {instructions.map((ins, i) => (
              <div key={i} className="flex items-start gap-[4px]">
                <div className="size-[10px] rounded-full bg-[#6366f1] flex items-center justify-center shrink-0 mt-[1px]">
                  <span className="text-[5px] font-bold text-white font-inter">{i + 1}</span>
                </div>
                <span className="text-[6px] text-[#475569] font-inter leading-[1.4]">{ins}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instruction list */}
        <div className="flex flex-col gap-[6px] flex-1 justify-center">
          {instructions.map((ins, i) => (
            <div key={i} className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[10px] bg-[#f8fafc] border border-[#f1f5f9]">
              <div className="size-[18px] rounded-full bg-[#6366f1] flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-white font-inter">{i + 1}</span>
              </div>
              <span className="text-[12px] font-medium text-[#475569] font-inter flex-1">{ins}</span>
              <ChevronRight size={12} className="text-[#cbd5e1]" strokeWidth={2} />
            </div>
          ))}
          <button className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors mt-[2px] w-fit">
            <Plus size={11} strokeWidth={2.5} />
            Edit Instructions
          </button>
        </div>
      </div>

      <AISuggestion
        text='Add a note: product may be located on an end cap display.'
        actionLabel="Apply"
        onAction={() => onAIAction({
          title: 'Add End Cap Display Note',
          subtitle: 'AI suggestion · Shopper instructions',
          description: 'Adding a note about end cap displays will reduce missed sightings and improve data accuracy. Shoppers will know to check the end cap if the main shelf appears empty.',
          impact: [
            { label: 'Accuracy improvement', value: '+15%',     positive: true },
            { label: 'Missed sightings est.', value: '-20%',    positive: true },
            { label: 'Task time added',       value: '+10 sec' },
            { label: 'Steps updated',         value: '1 step',  positive: true },
          ],
          steps: [
            { label: 'Add note to instructions', detail: 'Insert: "Note: product may also be on end cap display near aisle entrance."' },
            { label: 'Update mobile preview',    detail: 'Refresh the shopper app preview to show the updated instruction.' },
            { label: 'Notify active shoppers',   detail: 'Send update notification to field agents already assigned to this campaign.' },
          ],
          confirmLabel: 'Apply Instruction Update',
        })}
      />
    </SectionCard>
  )
}

// ─── Summary Panel ────────────────────────────────────────────────────────────

function SummaryPanel() {
  const stats = [
    { label: 'Stores',              value: '120' },
    { label: 'SKUs',                value: '2' },
    { label: 'Estimated Cost',      value: '$2,400' },
    { label: 'Estimated Duration',  value: '3 days' },
  ]

  return (
    <div className="w-[260px] shrink-0 border-l border-[#f1f5f9] bg-white flex flex-col overflow-y-auto">
      <div className="px-[20px] py-[16px] border-b border-[#f1f5f9] shrink-0">
        <span className="text-[13px] font-bold text-[#0f172a] font-heading">Campaign Summary</span>
      </div>

      <div className="flex-1 px-[20px] py-[16px] flex flex-col gap-[16px]">
        {/* Stats */}
        <div className="flex flex-col gap-[0px]">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex items-center justify-between py-[10px] ${i < stats.length - 1 ? 'border-b border-[#f1f5f9]' : ''}`}>
              <span className="text-[12px] font-medium text-[#94a3b8] font-inter">{s.label}</span>
              <span className="text-[13px] font-bold text-[#0f172a] font-inter">{s.value}</span>
            </div>
          ))}
        </div>

        {/* AI insight */}
        <div className="flex flex-col gap-[8px] px-[14px] py-[12px] rounded-[12px] bg-[#f5f3ff] border border-[#e0e7ff]">
          <div className="flex items-center gap-[6px]">
            <Sparkles size={12} className="text-[#6366f1]" strokeWidth={2} />
            <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wide font-inter">AI Forecast</span>
          </div>
          <p className="text-[12px] text-[#4338ca] font-inter leading-snug italic">
            "Expected to uncover ~$9,000 in lost revenue across selected stores."
          </p>
        </div>

        {/* Coverage bar */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#566166] font-inter">Campaign Readiness</span>
            <span className="text-[11px] font-bold text-[#0f172a] font-inter">68%</span>
          </div>
          <div className="h-[6px] rounded-full bg-[#f1f5f9] overflow-hidden">
            <div className="h-full rounded-full bg-[#6366f1]" style={{ width: '68%' }} />
          </div>
          <span className="text-[10px] text-[#94a3b8] font-inter">Complete all sections to launch</span>
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide font-inter">Setup Checklist</span>
          {[
            { label: 'Campaign goal set',    done: true },
            { label: 'Products selected',    done: true },
            { label: 'Stores configured',    done: true },
            { label: 'Data fields enabled',  done: false },
            { label: 'Rules defined',        done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-[7px]">
              <div className={`size-[14px] rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-[#16a34a]' : 'bg-[#f1f5f9] border border-[#e2e8f0]'}`}>
                {item.done && (
                  <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                    <path d="M1 2.5l1.5 1.5L6 1" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[11px] font-inter ${item.done ? 'text-[#566166]' : 'text-[#94a3b8]'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Save size={14} strokeWidth={2} />
        Save Draft
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] bg-[#e9604b] text-white text-[13px] font-semibold font-inter hover:bg-[#d94f3a] transition-colors">
        <Rocket size={14} strokeWidth={2} />
        Launch Campaign
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignConfiguration() {
  const [drawerAction, setDrawerAction] = useState<DrawerAction | null>(null)

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header />
        <CampaignTabBar id="1" />
        <AIAssistBar onAutoConfigure={() => setDrawerAction({
          title: 'Auto-Configure Campaign',
          subtitle: 'AI assistant · Based on recent gaps and performance',
          description: 'I can fully configure this campaign for you — setting the goal, selecting 12 high-priority stores, mapping your SKUs, and pre-filling rules based on your most recent campaign data.',
          impact: [
            { label: 'Setup time saved',  value: '~25 min',   positive: true },
            { label: 'Stores pre-selected', value: '120 stores', positive: true },
            { label: 'SKUs mapped',       value: '2 SKUs',    positive: true },
            { label: 'Readiness score',   value: '95%',       positive: true },
          ],
          steps: [
            { label: 'Set campaign goal',      detail: 'Configure as Shelf Audit with OOS and stock threshold objectives.' },
            { label: 'Pre-select stores',      detail: 'Auto-select 120 Target West stores based on prior campaign data.' },
            { label: 'Map SKUs',               detail: 'Map Cabernet Sauvignon and Sparkling Chardonnay to the campaign.' },
            { label: 'Set data capture fields',detail: 'Enable shelf photo, SKU presence, price, facings, and competitor fields.' },
            { label: 'Apply recommended rules',detail: 'Set 14-unit threshold and approved pricing range from last campaign.' },
            { label: 'Generate instructions',  detail: 'Auto-generate shopper instructions based on most successful prior campaign.' },
          ],
          confirmLabel: 'Auto-Configure Campaign',
        })} />

        {/* White canvas */}
        <div className="flex flex-1 min-h-0 rounded-b-xl bg-white overflow-hidden">
          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-[32px] py-[24px] pb-[80px] flex flex-col gap-[16px]">
            <SectionGoal onAIAction={setDrawerAction} />
            <SectionProducts />
            <SectionStores onAIAction={setDrawerAction} />
            <SectionDataCapture onAIAction={setDrawerAction} />
            <SectionExpectations onAIAction={setDrawerAction} />
            <SectionShopperInstructions onAIAction={setDrawerAction} />
          </div>

          {/* Summary panel */}
          <SummaryPanel />
        </div>
      </div>

      <Footer />
      <AIActionDrawer action={drawerAction} onClose={() => setDrawerAction(null)} />
    </div>
  )
}
