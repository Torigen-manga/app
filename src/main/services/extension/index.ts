import { access, mkdir, writeFile, readFile, readdir } from 'fs/promises'
import type { SourceInfo, SourceProvider } from '@torigen/mounter'
import type { Registry } from '@shared/types/extensions'
import { pathToFileURL } from 'url'
import { app } from 'electron'
import path from 'path'

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

  async loadRegistry(): Promise<Registry> {
    await this.ensureRegistry()

    try {
      const data = await readFile(this.registryFile, 'utf-8')
      const parsed: Registry = JSON.parse(data)

      return parsed
    } catch (err) {
      throw err
    }
  }

  async saveRegistry(registry: Registry): Promise<void> {
    await this.ensureRegistry()

    try {
      await writeFile(this.registryFile, JSON.stringify(registry, null, 2))
    } catch (err) {
      throw err
    }
  }

  async loadExtensions(): Promise<string[]> {
    await this.ensureRegistry()
    const registry: Registry = await this.loadRegistry()
    const updatedRegistry: Registry = { ...registry }

    const list: string[] = []

    try {
      const dir = await readdir(this.base, { withFileTypes: true })
      const extensions = dir.filter((item) => item.isDirectory()).map((item) => item.name)

      const extensionPromises = extensions.map(async (ext) => {
        const extPath = path.join(this.base, ext)
        const manifestPath = path.join(extPath, 'manifest.json')

        try {
          await access(manifestPath)

          const rawManifest = await readFile(manifestPath, 'utf-8')
          const manifest: SourceInfo = JSON.parse(rawManifest)

          if (!manifest.id) {
            console.error('Manifest missing "id" field', manifest)
            return
          }

          updatedRegistry[manifest.id] = {
            name: manifest.name,
            version: manifest.version || '',
            path: extPath,
            main: 'bundle.js'
          }

          list.push(manifest.id)
        } catch (err) {
          console.error(`Failed to read manifest for extension ${ext}:`, err)
        }
      })

      await Promise.all(extensionPromises)

      if (JSON.stringify(registry) !== JSON.stringify(updatedRegistry)) {
        await this.saveRegistry(updatedRegistry)
      }

      return list
    } catch (err) {
      throw err
    }
  }

  async loadExtension(entry: string): Promise<SourceProvider> {
    const registry = await this.loadRegistry()

    const extension = registry[entry]

    if (!extension) {
      throw new Error(`Extension ${entry} not found in registry`)
    }

    const bundlePath = path.join(extension.path, extension.main)

    const code = await readFile(bundlePath, 'utf-8')

    const fileUrl = pathToFileURL(bundlePath).href

    const mod = await import(fileUrl)

    if (mod.default) {
      if (typeof mod.default === 'function') {
        return mod.default() as SourceProvider
      } else if (typeof mod.default === 'object') {
        return mod.default as SourceProvider
      }   
    }

    throw new Error(`Extension ${entry} does not export a default function`)
  }
}

const extensionsService = new ExtensionsService()

export { extensionsService }
