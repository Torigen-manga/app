import { access, mkdir, writeFile, readFile, readdir } from 'fs/promises'
import type { SourceInfo, SourceProvider } from '@torigen/mounter'
import type { Registry, RegistryEntry } from '@shared/types/extensions'
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
    } catch (err) {
      const initialRegistry: Registry = {}
      try {
        await writeFile(this.registryFile, JSON.stringify(initialRegistry, null, 2))
      } catch (writeErr) {
        throw writeErr
      }
    }
  }

  private async loadRegistry(): Promise<Registry> {
    await this.ensureRegistry()

    try {
      const data = await readFile(this.registryFile, 'utf-8')

      const parsed: Registry = JSON.parse(data)

      return parsed
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

  private async loadExtFolders(): Promise<string[]> {
    try {
      const folders: string[] = (await readdir(this.base, { withFileTypes: true }))
        .filter((item) => item.isDirectory())
        .map((item) => item.name)

      return folders
    } catch (err) {
      console.warn('Could not read extensions directory:', err)
      return []
    }
  }

  private async loadExtension(folderName: string) {
    const bundlePath = path.join(this.base, folderName, 'bundle.js')
    const fileUrl = pathToFileURL(bundlePath).href

    try {
      const mod = await import(fileUrl)

      if (!mod.default) {
        throw new Error(
          `Extension in ${folderName} does not have a default export (expected a Source class).`
        )
      }

      type SourceClassConstructor = new (requestManager: any) => SourceProvider
      const SourceClass = mod.default as SourceClassConstructor

      const requestManager = {}
      const sourceInstance = new SourceClass(requestManager)

      return sourceInstance.info as SourceInfo
    } catch (err) {
      throw new Error(`Failed to load extension from ${folderName}: ${(err as Error).message}`)
    }
  }

  private async syncRegistryWithFilesystem(): Promise<ExtensionSyncResult> {
    const currentFolders = await this.loadExtFolders()
    const currentRegistry = await this.loadRegistry()

    const result: ExtensionSyncResult = {
      loaded: [],
      failed: [],
      removed: []
    }

    const updatedRegistry: Registry = { ...currentRegistry }

    for (const folderName of currentFolders) {
      try {
        const extensionInfo = await this.loadExtension(folderName)

        const existingEntry = updatedRegistry[extensionInfo.id]

        if (!existingEntry) {
          console.log(`Discovered new extension: ${extensionInfo.name} (${extensionInfo.id})`)

          updatedRegistry[extensionInfo.id] = {
            name: extensionInfo.name,
            path: folderName,
            main: 'bundle.js',
            version: extensionInfo.version || '1.0.0',
            dependencies: extensionInfo.dependencies?.map((dep) => dep.name) || []
          }

          result.loaded.push(extensionInfo)
        } else {
          const needsUpdate =
            existingEntry.version !== (extensionInfo.version || '1.0.0') ||
            existingEntry.name !== extensionInfo.name ||
            existingEntry.path !== folderName

          if (needsUpdate) {
            console.log(`Updating extension metadata: ${extensionInfo.name}`)

            updatedRegistry[extensionInfo.id] = {
              ...existingEntry,
              name: extensionInfo.name,
              path: folderName,
              version: extensionInfo.version || '1.0.0',
              dependencies: extensionInfo.dependencies?.map((dep) => dep.name) || []
            }
          }

          result.loaded.push(extensionInfo)
        }
      } catch (err) {
        console.error(`Failed to process extension in folder ${folderName}:`, err)
        result.failed.push({ path: folderName, error: err as Error })
      }
    }

    const currentFolderSet = new Set(currentFolders)

    for (const [extensionId, entry] of Object.entries(updatedRegistry)) {
      if (!currentFolderSet.has(entry.path)) {
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

    if (!entry) {
      return null
    }

    return path.join(this.base, entry.path)
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
