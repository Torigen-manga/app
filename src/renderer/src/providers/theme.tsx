import { createContext, useContext, ReactNode } from 'react'
import { useTheme } from '@renderer/hooks/preferences/use-theme'

type ThemeContextType = ReturnType<typeof useTheme>

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
