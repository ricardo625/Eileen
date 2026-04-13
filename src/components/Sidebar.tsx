import { NavLink, useLocation } from 'react-router-dom'
import {
  Sparkles,
  BookOpen,
  BarChart2,
  Flag,
  List,
  Megaphone,
  Briefcase,
  Users,
  CreditCard,
  User,
  LogOut,
  Wine,
  Package,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'

type SubItem = { label: string; to: string; badge?: number }
type NavItem = { icon: LucideIcon; label: string; to?: string; subItems?: SubItem[]; badge?: number }

const topNavItems: NavItem[] = [
  { icon: Sparkles, label: 'AI Leon', to: '/ai-leon' },
  { icon: BookOpen, label: 'The Shelf', to: '/shelf', badge: 12 },
  {
    icon: BarChart2,
    label: 'Store Insights',
    to: '/banners',
    subItems: [
      { label: 'Banners', to: '/banners', badge: 3 },
    ],
  },
  { icon: List, label: 'All Submissions', to: '/submissions' },
  { icon: Megaphone, label: 'Campaign Hub', to: '/campaign-hub', badge: 5 },
  {
    icon: Briefcase,
    label: 'Brand Management',
    to: '/brand-management',
    subItems: [
      { label: 'Products', to: '/brand-management' },
      { label: 'Stores', to: '/brand-management/stores' },
    ],
  },
  { icon: Users, label: 'Team Members' },
  { icon: CreditCard, label: 'Billing' },
]

const bottomNavItems: NavItem[] = [
  { icon: User, label: 'User Profile' },
  { icon: LogOut, label: 'Logout' },
]

const subIcons: Record<string, LucideIcon> = {
  Products: Package,
  Stores: Store,
  Banners: Flag,
}

function Badge({ count }: { count: number }) {
  return (
    <span className="ml-auto shrink-0 min-w-[18px] h-[18px] px-[5px] rounded-full bg-[#e9604b] text-white text-[10px] font-bold font-inter flex items-center justify-center leading-none">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function SidebarItem({ icon: Icon, label, to, subItems, badge }: NavItem) {
  const location = useLocation()
  const { collapsed } = useSidebar()

  if (to && subItems) {
    const isParentActive = subItems.some(s => location.pathname === s.to)
    if (collapsed) {
      return (
        <NavLink
          to={to}
          className="flex items-center justify-center rounded-2xl py-[10px] w-full cursor-pointer hover:bg-white/60 transition-colors relative"
          title={label}
        >
          <Icon size={16} className={isParentActive ? 'text-[#e9604b] shrink-0' : 'text-[#64748b] shrink-0'} strokeWidth={isParentActive ? 2 : 1.75} />
          {badge != null && (
            <span className="absolute top-[4px] right-[4px] size-[7px] rounded-full bg-[#e9604b]" />
          )}
        </NavLink>
      )
    }
    return (
      <div className="flex flex-col gap-[2px]">
        <div className={`flex items-center gap-3 rounded-2xl px-3 py-[10px] w-full ${isParentActive ? '' : 'hover:bg-white/60'} transition-colors`}>
          <Icon size={16} className={isParentActive ? 'text-[#e9604b] shrink-0' : 'text-[#64748b] shrink-0'} strokeWidth={isParentActive ? 2 : 1.75} />
          <span className={`text-[14px] tracking-[-0.35px] font-inter ${isParentActive ? 'font-semibold text-[#e9604b]' : 'font-medium text-[#64748b]'}`}>{label}</span>
          {badge != null && <Badge count={badge} />}
        </div>
        <div className="flex flex-col gap-[2px] pl-[14px]">
          {subItems.map((sub) => {
            const SubIcon = subIcons[sub.label]
            return (
              <NavLink
                key={sub.to}
                to={sub.to}
                end={sub.to === '/brand-management'}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-[8px] bg-white rounded-2xl px-3 py-[8px] shadow-sm w-full cursor-pointer'
                    : 'flex items-center gap-[8px] rounded-2xl px-3 py-[8px] w-full cursor-pointer hover:bg-white/60 transition-colors'
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-px h-[14px] rounded-full ${isActive ? 'bg-[#e9604b]' : 'bg-[#e2e8f0]'}`} />
                    {SubIcon && <SubIcon size={13} className={isActive ? 'text-[#e9604b] shrink-0' : 'text-[#94a3b8] shrink-0'} strokeWidth={2} />}
                    <span className={`text-[13px] tracking-[-0.3px] font-inter ${isActive ? 'font-semibold text-[#e9604b]' : 'font-medium text-[#94a3b8]'}`}>
                      {sub.label}
                    </span>
                    {sub.badge != null && <Badge count={sub.badge} />}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    )
  }

  if (to) {
    if (collapsed) {
      return (
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive
              ? 'flex items-center justify-center rounded-2xl py-[10px] w-full cursor-pointer bg-white shadow-sm relative'
              : 'flex items-center justify-center rounded-2xl py-[10px] w-full cursor-pointer hover:bg-white/60 transition-colors relative'
          }
          title={label}
        >
          {({ isActive }) => (
            <>
              <Icon size={isActive ? 15 : 16} className={isActive ? 'text-[#e9604b] shrink-0' : 'text-[#64748b] shrink-0'} strokeWidth={isActive ? 2 : 1.75} />
              {badge != null && (
                <span className="absolute top-[4px] right-[4px] size-[7px] rounded-full bg-[#e9604b]" />
              )}
            </>
          )}
        </NavLink>
      )
    }
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? 'flex items-center gap-3 bg-white rounded-2xl px-3 py-[10px] shadow-sm w-full cursor-pointer'
            : 'flex items-center gap-3 rounded-2xl px-3 py-[10px] w-full cursor-pointer hover:bg-white/60 transition-colors'
        }
      >
        {({ isActive }) => (
          <>
            <Icon size={isActive ? 15 : 16} className={isActive ? 'text-[#e9604b] shrink-0' : 'text-[#64748b] shrink-0'} strokeWidth={isActive ? 2 : 1.75} />
            <span className={`text-[14px] tracking-[-0.35px] font-inter ${isActive ? 'font-semibold text-[#e9604b]' : 'font-medium text-[#64748b]'}`}>
              {label}
            </span>
            {badge != null && <Badge count={badge} />}
          </>
        )}
      </NavLink>
    )
  }

  if (collapsed) {
    return (
      <div className="flex items-center justify-center rounded-2xl py-[10px] w-full cursor-pointer hover:bg-white/60 transition-colors" title={label}>
        <Icon size={16} className="text-[#64748b] shrink-0" strokeWidth={1.75} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-[10px] w-full cursor-pointer hover:bg-white/60 transition-colors">
      <Icon size={16} className="text-[#64748b] shrink-0" strokeWidth={1.75} />
      <span className="text-[14px] font-medium text-[#64748b] tracking-[-0.35px] font-inter">{label}</span>
    </div>
  )
}

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <aside
      className="h-screen bg-[#f8fafc] flex flex-col py-6 z-20 shrink-0 overflow-hidden transition-[width] duration-200"
      style={{ width: collapsed ? 72 : 256 }}
    >
      {/* Brand */}
      <div className={`flex items-center ${collapsed ? 'justify-center flex-col gap-[6px] px-2' : 'gap-[12px] px-[8px]'} pb-[24px] shrink-0 w-full`}>
        {!collapsed && (
          <>
            <div className="relative size-[40px] bg-[#e9604b] rounded-[20px] flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
              <Wine size={20} className="text-white relative" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
              <div className="h-[20px] flex flex-col justify-center">
                <span className="text-[20px] font-bold leading-[20px] text-[#0f172a] font-heading">Workspace</span>
              </div>
              <div className="h-[15px] flex flex-col justify-center">
                <span className="text-[10px] font-semibold leading-[15px] text-[#94a3b8] tracking-[1px] uppercase font-inter">Management</span>
              </div>
            </div>
            <button
              onClick={toggle}
              className="flex items-center justify-center size-[28px] rounded-xl hover:bg-white/60 transition-colors text-[#94a3b8] hover:text-[#64748b] shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={15} strokeWidth={1.75} />
            </button>
          </>
        )}
        {collapsed && (
          <>
            <div className="relative size-[36px] bg-[#e9604b] rounded-[18px] flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-[18px] shadow-[0px_6px_12px_-2px_rgba(0,0,0,0.1)]" />
              <Wine size={17} className="text-white relative" strokeWidth={1.75} />
            </div>
            <button
              onClick={toggle}
              className="flex items-center justify-center size-[28px] rounded-xl hover:bg-white/60 transition-colors text-[#94a3b8] hover:text-[#64748b]"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={15} strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      {/* Nav links */}
      <div className={`flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto ${collapsed ? 'px-2' : 'px-4'}`}>
        {topNavItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </div>

      {/* Footer */}
      <div className={`border-t border-[#e2e8f0]/50 pt-4 flex flex-col gap-1 ${collapsed ? 'px-2' : 'px-4'}`}>
        {bottomNavItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </div>
    </aside>
  )
}
