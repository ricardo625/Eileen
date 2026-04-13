import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '../contexts/DarkModeContext'

export function DarkModeToggle() {
  const { dark, toggle } = useDarkMode()
  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="size-[32px] rounded-full border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] flex items-center justify-center text-[#566166] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors shadow-sm"
    >
      {dark ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={1.75} />}
    </button>
  )
}
