import { ipcMain } from 'electron'
import { preferencesService } from './instance'
import { type AppPreferences, apiWrapper, channels } from '@common/index'

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
