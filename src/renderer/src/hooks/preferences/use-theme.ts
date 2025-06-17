import { usePreferences } from './use-preferences'
import { useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const { layoutPreferences, loading, isUpdating, updateLayoutPreferences } = usePreferences()

  const theme = (layoutPreferences?.theme as Theme) || 'system'

  useEffect(() => {
    if (loading || isUpdating) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme, loading, isUpdating])

  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    updateLayoutPreferences({ theme: newTheme })
  }

  return {
    theme,
    setTheme,
    isLoading: loading || isUpdating
  }
}
