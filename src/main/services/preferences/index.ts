import { app } from 'electron'
import { mkdir, writeFile, access, readFile } from 'fs/promises'
import path from 'path'
import { defaultPreferences } from './default'
import type { AppPreferences } from '@shared/types/preferences'
import { appPreferencesSchema } from '@shared/types/preferences'

class PreferencesService {
  private readonly base = path.join(app.getPath('userData'), 'user')
  private readonly preferencesFile = path.join(this.base, 'preferences.json')

  private async ensurePreferences(): Promise<void> {
    try {
      console.log('Checking for existing preferences file...')
      await access(this.preferencesFile)
    } catch (error) {
      try {
        console.log('Preferences file not found, creating default preferences...')
        await mkdir(this.base, { recursive: true })

        const parsed = appPreferencesSchema.parse(defaultPreferences)

        await writeFile(this.preferencesFile, JSON.stringify(parsed, null, 2), 'utf-8')
      } catch (writeError) {
        console.error('Failed to create preferences file:', writeError)
        throw writeError
      }
    }
  }

  async loadPreferences(): Promise<AppPreferences> {
    await this.ensurePreferences()

    try {
      console.log('Loading preferences from file...')
      const data = await readFile(this.preferencesFile, 'utf-8')
      return appPreferencesSchema.parse(JSON.parse(data))
    } catch (error) {
      console.error('Failed to load preferences:', error)
      const parsed = appPreferencesSchema.parse(defaultPreferences)
      return appPreferencesSchema.parse(parsed)
    }
  }

  async savePreferences(preferences: AppPreferences): Promise<void> {
    await this.ensurePreferences()

    try {
      console.log('Saving preferences to file...')

      const parsed = appPreferencesSchema.parse(preferences)

      await writeFile(this.preferencesFile, JSON.stringify(parsed, null, 2), 'utf-8')
      console.log('Preferences saved successfully.')
    } catch (error) {
      console.error('Failed to save preferences:', error)
      throw error
    }
  }

  async resetPreferences(): Promise<void> {
    await this.ensurePreferences()
    const parsed = appPreferencesSchema.parse(defaultPreferences)
    await this.savePreferences(parsed)
  }
}

const preferencesService = new PreferencesService()

export { preferencesService }
