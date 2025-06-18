import { app } from 'electron'
import { mkdir, writeFile, access, readFile } from 'fs/promises'
import path from 'path'
import { defaultPreferences } from './default'
import { type AppPreferences, appPreferencesSchema } from '@common/index'

class PreferencesService {
  private readonly base = path.join(app.getPath('userData'), 'user')
  private readonly preferencesFile = path.join(this.base, 'preferences.json')

  private async ensurePreferences(): Promise<void> {
    try {
      await access(this.preferencesFile)
    } catch (error) {
      try {
        await mkdir(this.base, { recursive: true })

        const parsed = appPreferencesSchema.parse(defaultPreferences)

        await writeFile(this.preferencesFile, JSON.stringify(parsed, null, 2), 'utf-8')
      } catch (writeError) {
        throw writeError
      }
    }
  } 

  async loadPreferences(): Promise<AppPreferences> {
    await this.ensurePreferences()
    console.log('Loading preferences from:', this.preferencesFile)

    try {
      const data = await readFile(this.preferencesFile, 'utf-8')
      console.log('Preferences file read successfully:', this.preferencesFile)
      return appPreferencesSchema.parse(JSON.parse(data))
    } catch (error) {
      console.error('Error reading preferences file:', error)
      const parsed = appPreferencesSchema.parse(defaultPreferences)
      return appPreferencesSchema.parse(parsed)
    }
  }

  async savePreferences(preferences: AppPreferences): Promise<void> {
    await this.ensurePreferences()

    try {
      const parsed = appPreferencesSchema.parse(preferences)

      await writeFile(this.preferencesFile, JSON.stringify(parsed, null, 2), 'utf-8')
    } catch (error) {
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
