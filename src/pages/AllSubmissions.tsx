import { useNavigate } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  MoreVertical,
  MoreHorizontal,
  ChevronDown,
  Plus,
  ImageOff,
} from 'lucide-react'

import userAvatar from '../assets/avatar.png'
import Sidebar from '../components/Sidebar'
import { DarkModeToggle } from '../components/DarkModeToggle'

// Figma asset URLs
const imgWineDisplay = 'https://www.figma.com/api/mcp/asset/94053dd0-59a4-4dda-89f7-e0d448ed3a05'
const imgEmptyShelves = 'https://www.figma.com/api/mcp/asset/7a73ce9e-6a26-4828-a2d9-12612c4d436b'
const imgAvatarSarah = 'https://www.figma.com/api/mcp/asset/b2a08d96-a8d5-4f61-b806-11fd722eb722'
const imgAvatarMarc = 'https://www.figma.com/api/mcp/asset/f01caa48-81ff-4373-9c7d-cd3494894a12'
const imgUserAvatar = userAvatar

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-10 h-[80px] flex items-center justify-between px-[32px] border-b border-[#f8fafc] backdrop-blur-[6px] bg-[#f8fafc]/90 shrink-0">
      {/* Title */}
      <div className="flex flex-col">
        <div className="text-[24px] font-bold leading-[32px] text-[#0f172a] font-heading">All Submissions</div>
        <div className="text-[12px] font-medium leading-[16px] text-[#64748b] font-inter">
          Review all submissions in chronological order
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[16px]">
        {/* Search bar */}
        <div className="relative shrink-0">
          <div className="w-[256px] bg-[#eaf0f5] rounded-full flex items-start overflow-hidden pt-[9px] pb-[10px] pl-[40px] pr-[16px]">
            <span className="text-[14px] font-normal text-[#6b7280] font-inter leading-normal whitespace-nowrap">
              Search submissions...
            </span>
          </div>
          <Search
            size={15}
            className="absolute left-[14.5px] top-1/2 -translate-y-1/2 text-[#6b7280]"
            strokeWidth={2}
          />
        </div>

        {/* Divider + button group */}
        <div className="flex items-center gap-[8px] pl-[17px] border-l border-[#e2e8f0]">
          <button className="text-[14px] font-semibold text-[#e9604b] font-inter leading-[20px]">
            Reset Filters
          </button>
          <button className="p-[8px] rounded-full hover:bg-black/5 transition-colors text-[#566166]">
            <SlidersHorizontal size={18} strokeWidth={1.75} />
          </button>
          <button className="p-[8px] rounded-full hover:bg-black/5 transition-colors text-[#566166]">
            <LayoutGrid size={18} strokeWidth={1.75} />
          </button>
          <button className="p-[8px] rounded-full hover:bg-black/5 transition-colors text-[#566166]">
            <MoreVertical size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* User avatar */}
        <div className="pl-[8px] flex items-center gap-[8px]">
          <DarkModeToggle />
          <div className="size-[32px] rounded-full border-2 border-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[2px] bg-white/0 overflow-hidden">
            <img
              src={imgUserAvatar}
              alt="User avatar"
              className="size-[28px] rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Cards ───────────────────────────────────────────────────────────────────

function WineTag({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between bg-[#fcf4f3] rounded-2xl pl-4 pr-2 py-2">
      <span className="text-[12px] font-semibold text-[#566166] whitespace-nowrap font-inter">{label}</span>
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f9e8e5] shrink-0">
        <span className="text-[11px] font-semibold text-[#e9604b] font-inter">{count}</span>
      </div>
    </div>
  )
}

type Status = 'VALIDATED' | 'FAILED' | 'PARTIAL'

const statusStyles: Record<Status, string> = {
  VALIDATED: 'bg-[#0053db]/90 backdrop-blur-md text-white',
  FAILED: 'bg-[#9e3f4e] text-white',
  PARTIAL: 'bg-[#535f78] text-white',
}

interface SubmissionCardProps {
  id: string
  status: Status
  image?: string
  isError?: boolean
  title: string
  description: string
  wineTags: { label: string; count: number }[]
  completedBy: string
  timeAgo: string
  avatarSrc?: string
  isAI?: boolean
}

function SubmissionCard({
  id,
  status,
  image,
  isError,
  title,
  description,
  wineTags,
  completedBy,
  timeAgo,
  avatarSrc,
  isAI,
}: SubmissionCardProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/submissions/${id}`)}
      className="bg-white border border-black/5 rounded-[20px] overflow-hidden shadow-sm flex flex-col cursor-pointer hover:shadow-md hover:-translate-y-[2px] transition-all duration-150"
    >
      {/* Image / Error area */}
      <div className="h-48 relative overflow-hidden shrink-0">
        {isError ? (
          <div className="w-full h-full bg-[#4f0116]/5 border-b border-[#9e3f4e]/10 flex flex-col items-center justify-center gap-2">
            <ImageOff size={36} className="text-[#9e3f4e]" strokeWidth={1.5} />
            <span className="text-[14px] font-semibold text-[#9e3f4e] font-inter">Error: Image not found</span>
          </div>
        ) : (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        )}
        {/* Status badge */}
        <span
          className={`absolute top-2.5 left-3 px-2 py-[2.5px] rounded-full text-[10px] font-semibold shadow-sm font-inter ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title + description */}
        <div className="mb-4">
          <h3 className="text-[18px] font-bold text-[#2a3439] leading-7 font-heading">{title}</h3>
          <p className="text-[14px] text-[#566166] leading-5 truncate font-inter">{description}</p>
        </div>

        {/* Wine tags */}
        <div className="flex flex-col gap-2 mb-6">
          {wineTags.map((tag) => (
            <WineTag key={tag.label} label={tag.label} count={tag.count} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[#e8eff3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAI ? (
              <div className="w-6 h-6 rounded-full bg-[#e4e1e6] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-[#3f3f43] font-inter">AI</span>
              </div>
            ) : (
              <img src={avatarSrc} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
            )}
            <div>
              <p className="text-[11px] font-semibold text-[#2a3439] leading-none font-inter">{completedBy}</p>
              <p className="text-[11px] text-[#566166] mt-1 font-inter">{timeAgo}</p>
            </div>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-[#566166] hover:text-[#2a3439] transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

const wineTags = [
  { label: 'Cabernet Sauvignon', count: 4 },
  { label: 'Merlot', count: 2 },
]

const submissions: SubmissionCardProps[] = [
  {
    id: '1',
    status: 'VALIDATED',
    image: imgWineDisplay,
    title: 'Grand Cru Estates',
    description: 'Premium wine selection audit for Q3…',
    wineTags,
    completedBy: 'Completed by Sarah L.',
    timeAgo: '2 hours ago',
    avatarSrc: imgAvatarSarah,
  },
  {
    id: '2',
    status: 'FAILED',
    isError: true,
    title: 'Urban Cellars Metro',
    description: 'Incomplete capture due to sensor…',
    wineTags,
    completedBy: 'Completed by Marc D.',
    timeAgo: '4 hours ago',
    avatarSrc: imgAvatarMarc,
  },
  {
    id: '3',
    status: 'PARTIAL',
    image: imgEmptyShelves,
    title: 'Downtown Spritz Hub',
    description: 'Stock level check for seasonal…',
    wineTags,
    completedBy: 'Completed by Auto-Scan',
    timeAgo: '5 hours ago',
    isAI: true,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllSubmissions() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 pr-4 pb-4 flex flex-col min-h-screen">
        <Header />

        {/* Content canvas */}
        <main className="bg-white rounded-xl flex-1 mt-0 px-8 pt-8 pb-12 relative overflow-hidden">
          {/* Dashboard info row */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[16px] font-medium text-[#2a3439] font-inter">
              Showing{' '}
              <span className="font-semibold text-[#e9604b]">15</span>
              {' '}of 2,431 submissions
            </p>
            <button className="flex items-center gap-2 bg-[#fcf4f3] rounded-2xl px-4 py-2">
              <span className="text-[14px] font-medium text-[#566166] font-inter">25 per page</span>
              <ChevronDown size={12} className="text-[#566166]" strokeWidth={2} />
            </button>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.title} {...submission} />
            ))}
          </div>

          {/* FAB */}
          <button className="absolute bottom-8 right-8 flex items-center gap-2 bg-[#e9604b] text-white rounded-2xl px-4 py-4 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-[#d94f3a] transition-colors">
            <Plus size={14} strokeWidth={2.5} />
            <span className="text-[16px] font-semibold pr-2 font-inter">New Submission</span>
          </button>
        </main>
      </div>
    </div>
  )
}
