import { extensionService, registryService } from './extension'

async function ensureExtensionService(): Promise<void> {
  await Promise.allSettled([extensionService.init(), registryService.init()])
}
async function ensureDatabase(): Promise<void> {}

export { ensureDatabase, ensureExtensionService }
