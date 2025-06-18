import type { AppPreferences } from '@common/index'

const defaultPreferences: AppPreferences = {
  layoutPreferences: {
    gridSize: 8,
    theme: 'system',
    showTitles: true,
    compactMode: false,
    showReadIndicator: true,
    coverStyle: 'default'
  },
  readerDisplayPreferences: {
    pageLayout: 'single-page',
    zoomBehavior: 'fit-width',
    readingDirection: 'ltr',
    zoomLevel: undefined,
    rememberZoom: true
  },
  libraryHistoryPreferences: {
    enabled: true,
    maxEntries: 100,
    showRecent: true
  },
  systemBehaviorPreferences: {
    updateOnStartup: true,
    confirmRemoval: true,
    enableNotifications: true
  },
  experimentalPreferences: {
    enableCustomSources: true,
    enableDebugLogging: false,
    hardwareAcceleration: true
  }
}

export { defaultPreferences }
