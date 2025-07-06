import { access, writeFile, readFile, readdir } from 'fs/promises'
import type { SourceInfo, SourceProvider } from '@torigen/mounter'
import type { Registry, RegistryEntry } from '@common/index'
import { pathToFileURL } from 'url'
import { directories, paths } from '../../paths'
import path from 'path'

interface ExtensionSyncResult {
  loaded: SourceInfo[]
  failed: Array<{ path: string; error: Error }>
  removed: string[]
}

class RegistryService {
  private readonly base = directories.extensionsDir
  private readonly registryFile = paths.registryFilePath

  async init(): Promise<void> {
    await this.ensureRegistry()
  }

  private async ensureRegistry(): Promise<void> {
    try {
      await access(this.registryFile)
    } catch {
      const initialRegistry: Registry = {}
      await writeFile(this.registryFile, JSON.stringify(initialRegistry, null, 2))
    }
  }

  private async loadRegistry(): Promise<Registry> {
    try {
      const data = await readFile(this.registryFile, 'utf-8')
      return JSON.parse(data)
    } catch (err) {
      return {}
    }
  }

  private async saveRegistry(registry: Registry): Promise<boolean> {
    try {
      await writeFile(this.registryFile, JSON.stringify(registry, null, 2))
      return true
    } catch (err) {
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

      const requestManager = {}
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

        updatedRegistry[info.id] = {
          name: info.name,
          path: fileName,
          dependencies: info.dependencies?.map((dep) => dep.name) || []
        }

        result.loaded.push(info)
      } catch (err) {
        result.failed.push({ path: fileName, error: err as Error })
      }
    }

    const currentFileSet = new Set(currentFiles)

    for (const [extensionId, entry] of Object.entries(updatedRegistry)) {
      if (!currentFileSet.has(entry.path)) {
        delete updatedRegistry[extensionId]
        result.removed.push(extensionId)
      }
    }

    await this.saveRegistry(updatedRegistry)

    return result
  }

  async loadExtensions(): Promise<SourceInfo[]> {
    try {
      const syncResult = await this.syncRegistryWithFilesystem()

      if (syncResult.failed.length > 0) {
        syncResult.failed.forEach(({ path, error }) => {
          console.warn(`  - ${path}: ${error.message}`)
        })
      }

      return syncResult.loaded
    } catch (err) {
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

const registryService = new RegistryService()
export { registryService }
