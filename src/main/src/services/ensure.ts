import { preferencesService } from './preferences'
import { registryService, extensionService } from './extension'
import { appMangaService } from './app'
import { libraryService } from './library/instance'
import { app } from 'electron'

async function ensureServicesFiles(): Promise<void> {
  const serviceName = ['registry', 'extension', 'preferences', 'appManga', 'library']

  const results = await Promise.allSettled([
    registryService.init(),
    extensionService.init(),
    preferencesService.init(),
    appMangaService.init(),
    libraryService.init()
  ])

  let criticalFailure: boolean = false

  results.forEach((result, index) => {
    const name = serviceName[index]

    if (result.status === 'rejected') {
      console.error(`❌ Failed to initialize ${name}:`, result.reason)

      if (name === 'registry' || name === 'appManga') {
        criticalFailure = true
      }
    } else {
      console.log(`✅ Initialized ${name}`)
    }

    if (criticalFailure) {
      console.error('❌ Critical service(s) failed. Quitting app...')
      app.quit()
    }
  })
}

export { ensureServicesFiles }
