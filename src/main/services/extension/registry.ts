import { access, mkdir, writeFile, readFile, readdir } from 'fs/promises'
import type { SourceInfo, SourceProvider } from '@torigen/mounter'
import type { Registry, RegistryEntry } from '@common/index'
import { pathToFileURL } from 'url'
import { app } from 'electron'
import path from 'path'

interface ExtensionSyncResult {
  loaded: SourceInfo[]
  failed: Array<{ path: string; error: Error }>
  removed: string[]
}

class ExtensionsService {
  private readonly base = path.join(app.getPath('userData'), 'user', 'extensions')
  private readonly registryFile = path.join(this.base, 'registry.json')

  private async ensureRegistry(): Promise<void> {
    try {
      await mkdir(this.base, { recursive: true })
      await access(this.registryFile)
    } catch {
      const initialRegistry: Registry = {}
      await writeFile(this.registryFile, JSON.stringify(initialRegistry, null, 2))
    }
  }

  private async loadRegistry(): Promise<Registry> {
    await this.ensureRegistry()

    try {
      const data = await readFile(this.registryFile, 'utf-8')
      return JSON.parse(data)
    } catch (err) {
      console.warn('Could not load registry, using empty registry:', err)
      return {}
    }
  }

  private async saveRegistry(registry: Registry): Promise<boolean> {
    await this.ensureRegistry()

    try {
      await writeFile(this.registryFile, JSON.stringify(registry, null, 2))
      return true
    } catch (err) {
      console.error('Failed to save registry:', err)
      return false
    }
  }

  private async loadExtension(fileName: string) {
    const filePath = path.join(this.base, fileName)
    const fileUrl = pathToFileURL(filePath).href

    try {
      const mod = await import(fileUrl)

      if (!mod.default) {
        throw new Error(
          `Extension in ${fileName} does not have a default export (expected a Source class).`
        )
      }

      type SourceClassConstructor = new (requestManager: any) => SourceProvider
      const SourceClass = mod.default as SourceClassConstructor

      const requestManager = {} // replace if needed
      const sourceInstance = new SourceClass(requestManager)

      return { fileName, info: sourceInstance.info as SourceInfo }
    } catch (err) {
      throw new Error(`Failed to load extension from ${fileName}: ${(err as Error).message}`)
    }
  }

  private async loadExtFiles(): Promise<string[]> {
    try {
      const files = await readdir(this.base, { withFileTypes: true })
      return files
        .filter((item) => item.isFile() && item.name.endsWith('.js'))
        .map((item) => item.name)
    } catch (err) {
      console.warn('Could not read extensions directory:', err)
      return []
    }
  }

  private async syncRegistryWithFilesystem(): Promise<ExtensionSyncResult> {
    const currentFiles = await this.loadExtFiles()
    const currentRegistry = await this.loadRegistry()

    const result: ExtensionSyncResult = {
      loaded: [],
      failed: [],
      removed: []
    }

    const updatedRegistry: Registry = { ...currentRegistry }

    for (const fileName of currentFiles) {
      try {
        const { info } = await this.loadExtension(fileName)
        const existingEntry = updatedRegistry[info.id]

        if (!existingEntry) {
          console.log(`Discovered new extension: ${info.name} (${info.id})`)
        }

        updatedRegistry[info.id] = {
          name: info.name,
          path: fileName,
          dependencies: info.dependencies?.map((dep) => dep.name) || []
        }

        result.loaded.push(info)
      } catch (err) {
        console.error(`Failed to process extension file ${fileName}:`, err)
        result.failed.push({ path: fileName, error: err as Error })
      }
    }

    const currentFileSet = new Set(currentFiles)

    for (const [extensionId, entry] of Object.entries(updatedRegistry)) {
      if (!currentFileSet.has(entry.path)) {
        console.log(`Removing stale registry entry for: ${entry.name} (${extensionId})`)
        delete updatedRegistry[extensionId]
        result.removed.push(extensionId)
      }
    }

    await this.saveRegistry(updatedRegistry)

    return result
  }

  async loadExtensions(): Promise<SourceInfo[]> {
    await this.ensureRegistry()

    try {
      const syncResult = await this.syncRegistryWithFilesystem()

      if (syncResult.failed.length > 0) {
        console.warn(`Failed to load ${syncResult.failed.length} extensions:`)
        syncResult.failed.forEach(({ path, error }) => {
          console.warn(`  - ${path}: ${error.message}`)
        })
      }

      if (syncResult.removed.length > 0) {
        console.log(`Cleaned up ${syncResult.removed.length} stale registry entries`)
      }

      console.log(`Successfully loaded ${syncResult.loaded.length} extensions`)

      return syncResult.loaded
    } catch (err) {
      console.error('Critical error during extension loading:', err)
      throw err
    }
  }

  async getExtensionPath(extensionId: string): Promise<string | null> {
    const registry = await this.loadRegistry()
    const entry = registry[extensionId]
    return entry ? path.join(this.base, entry.path) : null
  }

  async getExtensionEntry(extensionId: string): Promise<RegistryEntry | null> {
    const registry = await this.loadRegistry()
    return registry[extensionId] || null
  }

  async hasExtension(extensionId: string): Promise<boolean> {
    const registry = await this.loadRegistry()
    return extensionId in registry
  }
}

const extensionsService = new ExtensionsService()
export { extensionsService }
