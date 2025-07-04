import { usePreferences } from './use-preferences'
import { useEffect } from 'react'
import type { Theme, PreferDarkMode } from '@common/src/types'

function resolveThemeClasses(theme: Theme, preferDarkMode: PreferDarkMode): string[] {
  type ThemeMap = Record<Theme, Record<'light' | 'dark', string[]>>

  const themeMap: ThemeMap = {
    default: {
      light: [],
      dark: ['dark']
    },
    strawberryRush: {
      light: ['strawberry-rush'],
      dark: ['strawberry-rush', 'strawberry-night'] // Apply BOTH classes
    },
    blueberryBreeze: {
      light: ['blueberry-breeze'],
      dark: ['blueberry-breeze', 'blueberry-dark'] // Apply BOTH classes
    }
  }

  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const effectiveMode =
    preferDarkMode === 'system' ? (isSystemDark ? 'dark' : 'light') : preferDarkMode

  return themeMap[theme][effectiveMode]
}

export function useTheme() {
  const { layoutPreferences, loading, isUpdating, updateLayoutPreferences } = usePreferences()

  const theme: Theme = (layoutPreferences?.theme as Theme) || 'default'
  const preferDarkMode: PreferDarkMode =
    (layoutPreferences?.preferDarkMode as PreferDarkMode) || 'system'

  const applyTheme = (newTheme: Theme, newPreferDarkMode: PreferDarkMode) => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove(
      'dark',
      'blueberry-breeze',
      'blueberry-dark',
      'strawberry-rush',
      'strawberry-night'
    )

    // Add the resolved classes (could be multiple)
    const resolvedClasses = resolveThemeClasses(newTheme, newPreferDarkMode)
    resolvedClasses.forEach((className) => {
      root.classList.add(className)
    })
  }

  useEffect(() => {
    if (loading || isUpdating) return
    applyTheme(theme, preferDarkMode)
  }, [theme, preferDarkMode, loading, isUpdating])

  useEffect(() => {
    if (preferDarkMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyTheme(theme, 'system')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, preferDarkMode])

  const setTheme = (newTheme: Theme) => {
    updateLayoutPreferences({ theme: newTheme })
  }

  const setPreferDarkMode = (newMode: PreferDarkMode) => {
    updateLayoutPreferences({ preferDarkMode: newMode })
  }

  return {
    theme,
    preferDarkMode,
    setTheme,
    setPreferDarkMode,
    isLoading: loading || isUpdating
  }
}
