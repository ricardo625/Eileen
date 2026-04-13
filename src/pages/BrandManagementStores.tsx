import { useState } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { AIActionDrawer, type DrawerAction } from '../components/AIActionDrawer'
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  Upload,
  RefreshCw,
  MapPin,
  List,
  Map,
  User,
  Layers,
  X,
  CheckCircle,
  Clock,
  Camera,
  Calendar,
  UserCircle,
  FileText,
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
          <div className="text-[24px] font-bold text-[#0f172a] font-heading leading-none">Stores</div>
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Plus size={13} strokeWidth={2.5} />
          Add Store
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Upload size={13} strokeWidth={2} />
          Import CSV
        </button>
        <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[10px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors shadow-sm">
          <Sparkles size={13} strokeWidth={2} />
          Sync
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

function AIInsightBar({ onFixCoverage }: { onFixCoverage: () => void }) {
  return (
    <div className="bg-[#1e293b] rounded-t-xl px-[32px] py-[13px] flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[6px]">
          <AlertTriangle size={13} className="text-[#fbbf24]" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white font-inter">18 stores without recent data</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <TrendingDown size={13} className="text-[#f87171]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">10 stores underperforming</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-[6px]">
          <Lightbulb size={13} className="text-[#818cf8]" strokeWidth={2} />
          <span className="text-[13px] font-medium text-white/80 font-inter">6 high-opportunity stores</span>
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <button className="px-[13px] py-[6px] rounded-full border border-white/20 text-[12px] font-medium text-white/80 font-inter hover:bg-white/10 transition-colors">
          View Issues
        </button>
        <button
          onClick={onFixCoverage}
          className="flex items-center gap-[6px] px-[13px] py-[6px] rounded-full bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
        >
          <Sparkles size={11} strokeWidth={2} />
          Fix Coverage
        </button>
      </div>
    </div>
  )
}

// ─── View Toggle ──────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }: { view: 'map' | 'list'; onChange: (v: 'map' | 'list') => void }) {
  return (
    <div className="flex items-center gap-[2px] bg-[#f1f5f9] rounded-[10px] p-[3px]">
      {([['map', Map, 'Map View'], ['list', List, 'List View']] as const).map(([v, Icon, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] text-[13px] font-medium font-inter transition-colors ${
            view === v ? 'bg-white text-[#2a3439] shadow-sm font-semibold' : 'text-[#94a3b8] hover:text-[#566166]'
          }`}
        >
          <Icon size={13} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── Map View ─────────────────────────────────────────────────────────────────

type MapStoreStatus = 'active' | 'low' | 'no-data'

const sfStores: { id: number; name: string; address: string; status: MapStoreStatus; lat: number; lng: number }[] = [
  { id: 1,  name: 'Target Mission',      address: '2800 Geary Blvd',    status: 'active',  lat: 37.7823, lng: -122.4538 },
  { id: 2,  name: 'Target SOMA',         address: '1690 Folsom St',     status: 'active',  lat: 37.7697, lng: -122.4148 },
  { id: 3,  name: 'Target Sunset',       address: '2600 Irving St',     status: 'low',     lat: 37.7639, lng: -122.4853 },
  { id: 4,  name: 'Target Marina',       address: '2055 Lombard St',    status: 'active',  lat: 37.7993, lng: -122.4368 },
  { id: 5,  name: 'Target Castro',       address: '2700 Market St',     status: 'low',     lat: 37.7632, lng: -122.4356 },
  { id: 6,  name: 'Target Noe Valley',   address: '3801 24th St',       status: 'active',  lat: 37.7517, lng: -122.4313 },
  { id: 7,  name: 'Target Chinatown',    address: '838 Kearny St',      status: 'no-data', lat: 37.7951, lng: -122.4064 },
  { id: 8,  name: 'Target Richmond',     address: '3251 20th Ave',      status: 'active',  lat: 37.7869, lng: -122.4746 },
  { id: 9,  name: 'Target FiDi',         address: '100 Pine St',        status: 'no-data', lat: 37.7928, lng: -122.3987 },
  { id: 10, name: 'Target Potrero Hill', address: '1600 17th St',       status: 'low',     lat: 37.7644, lng: -122.3979 },
]

const statusCfg: Record<MapStoreStatus, { fill: string; bg: string; text: string; label: string }> = {
  active:    { fill: '#16a34a', bg: '#f0fdf4', text: '#16a34a', label: 'Active' },
  low:       { fill: '#ea580c', bg: '#fff7ed', text: '#ea580c', label: 'Low activity' },
  'no-data': { fill: '#dc2626', bg: '#fef2f2', text: '#dc2626', label: 'No data' },
}

function MapView() {
  return (
    <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
      <MapContainer
        center={[37.773, -122.430]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sfStores.map((store) => {
          const cfg = statusCfg[store.status]
          return (
            <CircleMarker
              key={store.id}
              center={[store.lat, store.lng]}
              radius={9}
              pathOptions={{ fillColor: cfg.fill, color: 'white', weight: 2, fillOpacity: 0.9 }}
            >
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 150 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{store.name}</div>
                  <div style={{ color: '#64748b', marginBottom: 8 }}>{store.address}</div>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 20,
                    fontSize: 11, fontWeight: 600,
                    backgroundColor: cfg.bg, color: cfg.text,
                  }}>
                    {cfg.label}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm rounded-[12px] px-[14px] py-[10px] flex flex-col gap-[6px] shadow-md">
        {Object.values(statusCfg).map((cfg) => (
          <div key={cfg.label} className="flex items-center gap-[8px]">
            <div className="size-[8px] rounded-full shrink-0" style={{ background: cfg.fill }} />
            <span className="text-[11px] font-medium text-[#566166] font-inter">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Store count */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm rounded-[12px] px-[14px] py-[10px] shadow-md">
        <span className="text-[12px] font-semibold text-[#2a3439] font-inter">{sfStores.length} stores mapped</span>
      </div>
    </div>
  )
}

// ─── Filters ──────────────────────────────────────────────────────────────────

function FilterBar() {
  return (
    <div className="flex items-center gap-[10px] px-[32px] py-[14px] border-b border-[#f1f5f9] shrink-0">
      <div className="relative">
        <div className="w-[200px] bg-[#f1f5f9] rounded-full flex items-center pl-[36px] pr-[14px] py-[8px]">
          <span className="text-[13px] text-[#94a3b8] font-inter">Search stores…</span>
        </div>
        <Search size={13} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#94a3b8]" strokeWidth={2} />
      </div>
      {['Retailer', 'Status', 'Region'].map((f) => (
        <button key={f} className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-full border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#566166] font-inter hover:bg-[#f8fafc] transition-colors">
          {f}<ChevronDown size={11} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}

// ─── Store Table ──────────────────────────────────────────────────────────────

type StoreStatus = 'active' | 'low' | 'no-data'

interface Store {
  id: number
  name: string
  retailer: string
  location: string
  status: StoreStatus
  lastCheck: string
  coverage: string
  insights: string[]
}

const statusConfig: Record<StoreStatus, { dot: string; label: string; bg: string; text: string }> = {
  active:    { dot: 'bg-[#16a34a]', label: 'Active',       bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
  low:       { dot: 'bg-[#ea580c]', label: 'Low activity', bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]' },
  'no-data': { dot: 'bg-[#dc2626]', label: 'No data',      bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]' },
}

const stores: Store[] = [
  { id: 1, name: 'Target Shorewood',       retailer: 'Target',  location: 'Illinois, US',   status: 'active',  lastCheck: '2 days ago',  coverage: 'High',   insights: ['Stock stable', 'No issues detected', '8 facings confirmed'] },
  { id: 2, name: 'Target Albany',          retailer: 'Target',  location: 'New York, US',   status: 'low',     lastCheck: '10 days ago', coverage: 'Medium', insights: ['Stock velocity slowing', 'Restock recommended within 48h'] },
  { id: 3, name: 'Target Phoenix',         retailer: 'Target',  location: 'Arizona, US',    status: 'no-data', lastCheck: '—',           coverage: 'None',   insights: ['No recent data', 'Deploy field rep to verify'] },
  { id: 4, name: 'Miami Target',           retailer: 'Target',  location: 'Florida, US',    status: 'active',  lastCheck: '1 day ago',   coverage: 'High',   insights: ['Phantom inventory flagged', 'Verification dispatched'] },
  { id: 5, name: 'Chicago Lincoln Park',   retailer: 'Target',  location: 'Illinois, US',   status: 'active',  lastCheck: '3 days ago',  coverage: 'High',   insights: ['Full shelf gap detected', 'Emergency restock filed'] },
  { id: 6, name: 'Denver Walmart',         retailer: 'Walmart', location: 'Colorado, US',   status: 'no-data', lastCheck: '—',           coverage: 'None',   insights: ['No coverage since onboarding', 'Assign field rep'] },
  { id: 7, name: 'Seattle Safeway',        retailer: 'Safeway', location: 'Washington, US', status: 'low',     lastCheck: '8 days ago',  coverage: 'Low',    insights: ['Facing expansion opportunity', 'Buyer contact needed'] },
  { id: 8, name: 'Boston Prudential',      retailer: 'Target',  location: 'Massachusetts, US', status: 'active', lastCheck: '1 day ago', coverage: 'High',  insights: ['Recently restocked', 'All clear'] },
]

// ─── Submission photos ────────────────────────────────────────────────────────

const shelfPhotos = [
  {
    src: '/shelf-1.png',
    date: 'Mar 28, 2026',
    author: 'Field Agent — Carlos M.',
    notes: 'Snack aisle end-cap fully stocked. Competitor promo tag visible on adjacent section.',
  },
  {
    src: '/shelf-2.png',
    date: 'Apr 1, 2026',
    author: 'Field Agent — Priya S.',
    notes: 'Center aisle main facing. Products correctly placed per planogram. No gaps detected.',
  },
  {
    src: '/shelf-3.png',
    date: 'Apr 5, 2026',
    author: 'Field Agent — James T.',
    notes: 'Refrigerated section. Shelf tags visible. Low stock risk on two SKUs flagged for reorder.',
  },
]

function PhotoModal({ index, onClose, onPrev, onNext }: {
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const photo = shelfPhotos[index]
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex bg-white rounded-[20px] overflow-hidden shadow-2xl max-w-[860px] w-full mx-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-[540px] shrink-0 bg-[#0f172a] flex items-center justify-center">
          <img src={photo.src} alt={`Shelf ${index + 1}`} className="w-full h-full object-cover max-h-[480px]" />

          {/* Prev */}
          <button
            onClick={onPrev}
            className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[36px] rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 size-[36px] rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex gap-[6px]">
            {shelfPhotos.map((_, i) => (
              <div
                key={i}
                className={`h-[5px] rounded-full transition-all ${i === index ? 'w-[18px] bg-white' : 'w-[5px] bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex flex-col flex-1 px-[28px] py-[24px] gap-[20px]">
          {/* Close */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide font-inter">Submission {index + 1} of {shelfPhotos.length}</span>
            <button onClick={onClose} className="size-[28px] rounded-full hover:bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] transition-colors">
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center gap-[7px] text-[#94a3b8]">
                <Calendar size={12} strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wide font-inter">Date</span>
              </div>
              <span className="text-[14px] font-semibold text-[#0f172a] font-inter">{photo.date}</span>
            </div>

            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center gap-[7px] text-[#94a3b8]">
                <UserCircle size={12} strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wide font-inter">Author</span>
              </div>
              <span className="text-[14px] font-semibold text-[#0f172a] font-inter">{photo.author}</span>
            </div>

            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center gap-[7px] text-[#94a3b8]">
                <FileText size={12} strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wide font-inter">Notes</span>
              </div>
              <p className="text-[13px] font-medium text-[#566166] font-inter leading-[20px]">{photo.notes}</p>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-[8px] mt-auto pt-[16px] border-t border-[#f1f5f9]">
            {shelfPhotos.map((p, i) => (
              <div
                key={i}
                className={`w-[56px] h-[56px] rounded-[8px] overflow-hidden cursor-pointer border-2 transition-all ${i === index ? 'border-[#e9604b]' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={p.src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function StatusBadge({ status }: { status: StoreStatus }) {
  const cfg = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-[6px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold font-inter ${cfg.bg} ${cfg.text}`}>
      <span className={`size-[5px] rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function ExpandedStoreRow({ store, onClose }: { store: Store; onClose: () => void }) {
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const total = shelfPhotos.length

  return (
    <>
    <tr>
      <td colSpan={6} className="p-0">
        <div className="bg-[#f8fafc] border-t border-b border-[#f1f5f9] px-[32px] py-[20px]">
          <div className="flex gap-[24px]">
            {/* Info */}
            <div className="flex flex-col gap-[10px] w-[180px] shrink-0">
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Store Details</div>
              {[
                { label: 'Location', value: store.location },
                { label: 'Retailer', value: store.retailer },
                { label: 'Coverage', value: store.coverage },
                { label: 'Last Check', value: store.lastCheck },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-[8px]">
                  <span className="text-[11px] font-medium text-[#94a3b8] font-inter w-[60px] shrink-0 mt-[1px]">{label}</span>
                  <span className="text-[12px] font-semibold text-[#2a3439] font-inter">{value}</span>
                </div>
              ))}
            </div>

            {/* Recent submissions */}
            <div className="flex flex-col gap-[10px] flex-1">
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Recent Submissions</div>
              <div className="flex gap-[8px]">
                {store.status === 'no-data' ? (
                  <div className="flex items-center gap-[8px] bg-[#fef2f2] rounded-[10px] px-[14px] py-[10px] w-full">
                    <Camera size={14} className="text-[#dc2626] shrink-0" strokeWidth={2} />
                    <span className="text-[12px] font-medium text-[#dc2626] font-inter">No submissions yet for this store</span>
                  </div>
                ) : (
                  shelfPhotos.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setModalIndex(i)}
                      className="w-[80px] h-[80px] rounded-[10px] overflow-hidden shrink-0 border border-[#e2e8f0] cursor-pointer hover:border-[#e9604b] hover:shadow-md transition-all"
                    >
                      <img
                        src={photo.src}
                        alt={`Shelf submission ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="flex flex-col gap-[10px] w-[220px] shrink-0">
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Insights</div>
              <div className="flex flex-col gap-[6px]">
                {store.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-[7px]">
                    <CheckCircle size={12} className="text-[#16a34a] shrink-0 mt-[1px]" strokeWidth={2} />
                    <span className="text-[12px] font-medium text-[#566166] font-inter leading-[16px]">{insight}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-[8px] mt-[4px]">
                <button className="flex-1 py-[6px] rounded-[8px] bg-[#f1f5f9] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#e2e8f0] transition-colors">
                  Monitor
                </button>
                <button className="flex-1 py-[6px] rounded-[8px] bg-[#e9604b] text-[12px] font-semibold text-white font-inter hover:bg-[#d94f3a] transition-colors">
                  Add to Campaign
                </button>
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
    {modalIndex !== null && (
      <PhotoModal
        index={modalIndex}
        onClose={() => setModalIndex(null)}
        onPrev={() => setModalIndex((modalIndex - 1 + total) % total)}
        onNext={() => setModalIndex((modalIndex + 1) % total)}
      />
    )}
    </>
  )
}

function StoreTable({ onSelect, onAIAction }: { onSelect: (s: Store) => void; onAIAction: (a: DrawerAction) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const toggle = (id: number) => setExpanded(expanded === id ? null : id)

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-[#f1f5f9]">
            {['Store Name', 'Retailer', 'Location', 'Status', 'Last Check', 'Actions'].map((h) => (
              <th key={h} className="px-[20px] py-[12px] text-left text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <>
              <tr
                key={store.id}
                onClick={() => { toggle(store.id); onSelect(store) }}
                className={`border-b border-[#f8fafc] cursor-pointer transition-colors ${expanded === store.id ? 'bg-[#f8fafc]' : 'hover:bg-[#f8fafc]'}`}
              >
                <td className="px-[20px] py-[14px]">
                  <div className="flex items-center gap-[8px]">
                    <ChevronRight size={13} strokeWidth={2} className={`text-[#94a3b8] transition-transform ${expanded === store.id ? 'rotate-90' : ''}`} />
                    <div className="flex items-center gap-[8px]">
                      <MapPin size={13} className="text-[#94a3b8] shrink-0" strokeWidth={2} />
                      <span className="text-[14px] font-semibold text-[#2a3439] font-inter">{store.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#566166] font-inter">{store.retailer}</td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#566166] font-inter">{store.location}</td>
                <td className="px-[20px] py-[14px]"><StatusBadge status={store.status} /></td>
                <td className="px-[20px] py-[14px]">
                  <div className="flex items-center gap-[6px]">
                    <Clock size={11} className="text-[#94a3b8] shrink-0" strokeWidth={2} />
                    <span className={`text-[13px] font-inter ${store.lastCheck === '—' ? 'text-[#dc2626] font-medium' : 'text-[#566166]'}`}>{store.lastCheck}</span>
                  </div>
                </td>
                <td className="px-[20px] py-[14px]" onClick={(e) => e.stopPropagation()}>
                  {store.status === 'no-data' ? (
                    <button
                      onClick={() => onAIAction({
                        title: `Deploy: ${store.name}`,
                        subtitle: 'No data · First coverage deployment',
                        description: `${store.name} has never been monitored. I'll deploy a field representative and enable auto-check to start tracking shelf coverage at this location.`,
                        impact: [
                          { label: 'Coverage added',    value: '1 store',   positive: true },
                          { label: 'First check est.',  value: '48 hrs',    positive: true },
                          { label: 'Data gaps closed',  value: '1 store',   positive: true },
                          { label: 'Status change',     value: '→ Active',  positive: true },
                        ],
                        steps: [
                          { label: 'Assign field rep',      detail: `Schedule a field agent visit to ${store.name} within 48 hours.` },
                          { label: 'Enable auto-check',     detail: 'Activate weekly automated monitoring for this location.' },
                          { label: 'Add to campaign',       detail: 'Include store in the next active shelf audit campaign.' },
                          { label: 'Set coverage alerts',   detail: 'Enable alerts if no data is received after 7 days.' },
                        ],
                        confirmLabel: `Deploy to ${store.name}`,
                      })}
                      className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] bg-[#6366f1] text-[12px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors"
                    >
                      <Sparkles size={11} strokeWidth={2} />
                      Deploy
                    </button>
                  ) : store.status === 'low' ? (
                    <button
                      onClick={() => onAIAction({
                        title: `Check: ${store.name}`,
                        subtitle: 'Low coverage · Needs attention',
                        description: `${store.name} has low coverage and may have shelf issues that haven't been captured recently. I'll dispatch a field check and review the latest data.`,
                        impact: [
                          { label: 'Coverage restored', value: 'Active',   positive: true },
                          { label: 'Check scheduled',   value: '24 hrs',   positive: true },
                          { label: 'Issues detected',   value: 'TBD' },
                          { label: 'Last check',        value: store.lastCheck },
                        ],
                        steps: [
                          { label: 'Schedule field check',  detail: `Dispatch a field agent to ${store.name} within 24 hours.` },
                          { label: 'Review last data',      detail: 'Audit the most recent shelf data for anomalies or gaps.' },
                          { label: 'Update coverage score', detail: 'Recalculate the coverage score after the field visit completes.' },
                          { label: 'Set monitoring alert',  detail: 'Enable bi-weekly check alerts to prevent future low coverage.' },
                        ],
                        confirmLabel: `Check ${store.name}`,
                      })}
                      className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] bg-[#fff7ed] text-[12px] font-semibold text-[#ea580c] font-inter hover:bg-[#ffedd5] transition-colors border border-[#fed7aa]"
                    >
                      <Sparkles size={11} strokeWidth={2} />
                      Check
                    </button>
                  ) : (
                    <button className="px-[10px] py-[5px] rounded-[8px] border border-[#e2e8f0] text-[12px] font-semibold text-[#566166] font-inter hover:bg-[#f1f5f9] transition-colors">
                      View
                    </button>
                  )}
                </td>
              </tr>
              {expanded === store.id && (
                <ExpandedStoreRow key={`exp-${store.id}`} store={store} onClose={() => setExpanded(null)} />
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Gaps Panel ───────────────────────────────────────────────────────────────

function GapsPanel({ store, onAIAction }: { store: Store | null; onAIAction: (a: DrawerAction) => void }) {
  return (
    <div className="w-[272px] shrink-0 bg-white border-l border-[#f1f5f9] flex flex-col">
      <div className="px-[20px] py-[16px] border-b border-[#f1f5f9]">
        <div className="flex items-center gap-[7px]">
          <div className="size-[26px] rounded-full bg-[#6366f1]/10 flex items-center justify-center">
            <Sparkles size={13} className="text-[#6366f1]" strokeWidth={2} />
          </div>
          <span className="text-[14px] font-bold text-[#2a3439] font-heading">Coverage Insights</span>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] px-[20px] py-[16px] flex-1">
        {/* Summary */}
        <div className="bg-[#f0f0ff] rounded-[12px] p-[14px]">
          <p className="text-[13px] font-medium text-[#3730a3] font-inter leading-[20px]">
            {store?.status === 'no-data'
              ? `"${store.name}" has never been monitored. Deploy a field rep or enable auto-check to start coverage.`
              : 'You are missing data in 18% of your stores. Top stores not monitored this week need immediate attention.'
            }
          </p>
        </div>

        {/* Gaps list */}
        <div className="flex flex-col gap-[8px]">
          <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] font-inter">Coverage Gaps</div>
          {[
            { label: 'Target Phoenix — no data', type: 'error' },
            { label: 'Denver Walmart — no data', type: 'error' },
            { label: 'Target Albany — 10d since last check', type: 'warning' },
            { label: 'Seattle Safeway — low coverage', type: 'warning' },
          ].map(({ label, type }) => (
            <div key={label} className={`flex items-start gap-[8px] px-[10px] py-[8px] rounded-[10px] ${type === 'error' ? 'bg-[#fef2f2]' : 'bg-[#fff7ed]'}`}>
              <div className={`size-[6px] rounded-full shrink-0 mt-[4px] ${type === 'error' ? 'bg-[#dc2626]' : 'bg-[#ea580c]'}`} />
              <span className={`text-[12px] font-medium font-inter leading-[16px] ${type === 'error' ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-[8px]">
          {[['Active', '6', '#16a34a', '#f0fdf4'], ['Low', '4', '#ea580c', '#fff7ed'], ['No data', '2', '#dc2626', '#fef2f2'], ['Total', '8', '#6366f1', '#f0f0ff']].map(([label, count, color, bg]) => (
            <div key={label} className="rounded-[10px] px-[12px] py-[10px] flex flex-col gap-[2px]" style={{ background: bg }}>
              <span className="text-[18px] font-bold font-heading" style={{ color }}>{count}</span>
              <span className="text-[11px] font-medium text-[#94a3b8] font-inter">{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onAIAction({
            title: 'Fix All Coverage Gaps',
            subtitle: 'AI fix · 18 stores without recent data',
            description: 'I\'ve identified 18 stores without recent data and 10 underperforming locations. I can deploy field reps, enable auto-check, and add all gap stores to the next campaign automatically.',
            impact: [
              { label: 'Stores covered',    value: '18 stores', positive: true },
              { label: 'Coverage increase', value: '+22%',      positive: true },
              { label: 'Data gaps closed',  value: '18 gaps',   positive: true },
              { label: 'Time saved',        value: '~2 hrs',    positive: true },
            ],
            steps: [
              { label: 'Deploy to no-data stores',   detail: 'Schedule field reps for the 2 stores with zero monitoring history.' },
              { label: 'Check low-coverage stores',  detail: 'Dispatch agents to 4 stores with coverage below threshold.' },
              { label: 'Enable auto-check for all',  detail: 'Activate bi-weekly automated monitoring for all 18 stores.' },
              { label: 'Add to active campaign',     detail: 'Include all gap stores in the next scheduled shelf audit.' },
              { label: 'Set coverage alerts',        detail: 'Configure alerts if any store goes more than 10 days without data.' },
            ],
            confirmLabel: 'Fix All Coverage Gaps',
          })}
          className="flex items-center justify-center gap-[7px] w-full py-[10px] rounded-[12px] bg-[#6366f1] text-[13px] font-semibold text-white font-inter hover:bg-[#4f46e5] transition-colors mt-auto"
        >
          <Sparkles size={13} strokeWidth={2} />
          Fix All Coverage Gaps
        </button>
      </div>
    </div>
  )
}

// ─── Footer Bar ───────────────────────────────────────────────────────────────

function FooterBar() {
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 ml-32 flex items-center gap-[8px] bg-[#1e293b] rounded-[20px] px-[6px] py-[6px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] z-30">
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <Layers size={14} strokeWidth={2} />
        Bulk Deploy
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-white/70 text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <RefreshCw size={14} strokeWidth={2} />
        Assign to Campaign
      </button>
      <button className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[14px] text-[#f87171] text-[13px] font-semibold font-inter hover:bg-white/10 transition-colors">
        <X size={14} strokeWidth={2.5} />
        Remove
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrandManagementStores() {
  const [view, setView] = useState<'map' | 'list'>('list')
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [drawerAction, setDrawerAction] = useState<DrawerAction | null>(null)

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      <Sidebar />

      <div className="pr-4 pb-4 flex flex-col flex-1 overflow-hidden">
        <Header />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AIInsightBar onFixCoverage={() => setDrawerAction({
            title: 'Fix Store Coverage',
            subtitle: 'AI fix · 18 stores without recent data',
            description: '18 stores are missing recent shelf data, 10 are underperforming, and 6 have high-opportunity potential. I can deploy coverage across all gap stores in one automated sequence.',
            impact: [
              { label: 'Stores covered',    value: '18 stores', positive: true },
              { label: 'Coverage gain',     value: '+22%',      positive: true },
              { label: 'Opportunities',     value: '6 stores',  positive: true },
              { label: 'Time saved',        value: '~2 hrs',    positive: true },
            ],
            steps: [
              { label: 'Deploy to no-data stores',   detail: 'Schedule field reps for the 2 stores with zero monitoring history.' },
              { label: 'Check low-coverage stores',  detail: 'Dispatch agents to stores with coverage below threshold.' },
              { label: 'Enable auto-monitoring',     detail: 'Activate bi-weekly automated checks for all 18 gap stores.' },
              { label: 'Add to active campaign',     detail: 'Include all gap stores in the next scheduled shelf audit.' },
              { label: 'Set coverage alerts',        detail: 'Trigger alerts if any store goes more than 10 days without data.' },
            ],
            confirmLabel: 'Fix All Coverage',
          })} />

          <div className="flex flex-col flex-1 bg-white overflow-hidden rounded-b-xl">
            {/* Controls row */}
            <div className="flex items-center justify-between px-[32px] py-[14px] border-b border-[#f1f5f9] shrink-0">
              <ViewToggle view={view} onChange={setView} />
              <FilterBar />
            </div>

            {/* Map or table */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {view === 'map' ? (
                <div className="flex flex-1 min-h-0 overflow-hidden">
                  <MapView />
                  <GapsPanel store={selectedStore} onAIAction={setDrawerAction} />
                </div>
              ) : (
                <>
                  <StoreTable onSelect={setSelectedStore} onAIAction={setDrawerAction} />
                  <GapsPanel store={selectedStore} onAIAction={setDrawerAction} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterBar />
      <AIActionDrawer action={drawerAction} onClose={() => setDrawerAction(null)} />
    </div>
  )
}
