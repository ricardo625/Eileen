import { createContext, useContext, useState, useEffect } from 'react'

interface DarkModeContextValue {
  dark: boolean
  toggle: () => void
}

const DarkModeContext = createContext<DarkModeContextValue>({
  dark: false,
  toggle: () => {},
})

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <DarkModeContext.Provider value={{ dark, toggle: () => setDark((v) => !v) }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
