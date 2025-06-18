import { ipcMain } from 'electron'
import { channels } from '@shared/lib/methods'
import { preferencesService } from '.'
import { apiWrapper } from '@shared/types'

import type { AppPreferences } from '@shared/types/preferences'

const createPreferencesHandlers = () => {
  ipcMain.handle(channels.preferences.load, async () =>
    apiWrapper<AppPreferences>(() => preferencesService.loadPreferences())
  )

  ipcMain.handle(channels.preferences.save, async (_, newPreferences: AppPreferences) =>
    apiWrapper<void>(() => preferencesService.savePreferences(newPreferences))
  )

  ipcMain.handle(channels.preferences.reset, async () =>
    apiWrapper<void>(() => preferencesService.resetPreferences())
  )
}

export { createPreferencesHandlers }