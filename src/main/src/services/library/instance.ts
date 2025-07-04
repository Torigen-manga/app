import { access, readFile, writeFile, unlink, stat } from 'fs/promises'
import { directories, paths } from '../paths'
import type { AppLibrary, AppLibraryEntry, AppManga } from '@common/index'
import { appMangaService, AppMangaService } from '../app'
import type { LibraryServiceInterface } from '../interfaces'
import { extname, join } from 'path'
import { net } from 'electron'
import { createWriteStream } from 'fs'

const defaultLibrary: AppLibrary = {
  entries: [],
  categories: []
}

async function downloadCover(id: string, url: string): Promise<string> {
  const extension = extname(new URL(url).pathname) || '.jpg'
  const fileName = `${id}${extension}`
  const filePath = join(directories.coverCacheDir, fileName)

  try {
    await access(filePath)
    const stats = await stat(filePath)
    if (stats.size === 0) {
      await unlink(filePath)
    } else {
      return fileName
    }
  } catch {}

  return new Promise((resolve, reject) => {
    const request = net.request({ url })

    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download cover: ${response.statusMessage}`))
      }

      const fileStream = createWriteStream(filePath)

      fileStream.on('error', (err) => {
        fileStream.destroy()
        reject(err)
      })

      fileStream.on('finish', () => {
        resolve(fileName)
      })

      response.on('error', (err) => {
        fileStream.destroy()
        reject(err)
      })

      response.on('data', (chunk) => {
        fileStream.write(chunk)
      })

      response.on('end', () => {
        fileStream.end()
      })
    })

    request.on('error', (err) => {
      reject(err)
    })

    request.end()
  })
}

class LibraryService implements LibraryServiceInterface {
  readonly libraryFile = paths.libraryFilePath
  readonly appMangaService: AppMangaService

  constructor() {
    this.appMangaService = appMangaService
  }

  async init(): Promise<void> {
    await this.ensureLibraryExists()
  }

  private async ensureLibraryExists(): Promise<void> {
    try {
      await access(this.libraryFile)
    } catch (error) {
      await writeFile(this.libraryFile, JSON.stringify(defaultLibrary, null, 2), 'utf-8')
    }
  }

  async getLibrary(): Promise<AppLibrary> {
    const raw = await readFile(this.libraryFile, 'utf-8')
    return JSON.parse(raw) as AppLibrary
  }

  async addMangaToLibrary(data: AppManga): Promise<void> {
    const library = await this.getLibrary()

    const { sourceId, mangaId, cover, title } = data

    const id = `${sourceId}-${mangaId}`

    const existingIndex = library.entries.findIndex((entry) => entry.id === id)

    if (existingIndex !== -1) {
      return
    }

    let coverPath: string

    try {
      coverPath = `cover://${await downloadCover(id, cover)}`
    } catch (err) {
      coverPath = cover
    }

    const entry: AppLibraryEntry = {
      id,
      sourceId,
      mangaId,
      title,
      cover: coverPath,
      addedAt: new Date(),
      cachedTotalChapters: 0,
      category: []
    }

    library.entries.push(entry)

    await writeFile(this.libraryFile, JSON.stringify(library, null, 2))

    const manga = await this.appMangaService.getMangaById(data.sourceId, data.mangaId)

    if (!manga) {
      await this.appMangaService.addManga(data)
    }
  }

  async removeMangaFromLibrary(id: string): Promise<void> {
    const library = await this.getLibrary()

    const existingIndex = library.entries.findIndex((entry) => entry.id === id)

    if (existingIndex !== -1) {
      const entry = library.entries[existingIndex]
      if (!entry) {
        throw new Error(`Library entry with ID "${id}" does not exist.`)
      }
      if (entry.cover.startsWith('cover://')) {
        const fileName = entry.cover.replace('cover://', '')
        const filePath = join(directories.coverCacheDir, fileName)

        try {
          await unlink(filePath)
        } catch (error) {
          console.warn(`Failed to delete cached cover: ${(error as Error).message}`)
        }
      }

      library.entries.splice(existingIndex, 1)
      await writeFile(this.libraryFile, JSON.stringify(library, null, 2))
    }
  }

  async addCategory(name: string): Promise<void> {
    const library = await this.getLibrary()

    if (library.categories.some((cat) => cat.name === name)) {
      throw new Error(`Category "${name}" already exists.`)
    }

    const newCategory = {
      id: crypto.randomUUID(),
      name
    }

    library.categories.push(newCategory)

    await writeFile(this.libraryFile, JSON.stringify(library, null, 2))
  }

  async removeCategory(id: string): Promise<void> {
    const library = await this.getLibrary()

    const existingIndex = library.categories.findIndex((cat) => cat.id === id)

    if (existingIndex === -1) {
      throw new Error(`Category with ID "${id}" does not exist.`)
    }

    library.categories.splice(existingIndex, 1)

    for (const entry of library.entries) {
      if (entry.category?.includes(id)) {
        entry.category = entry.category.filter((catId) => catId !== id)
      }
    }

    await writeFile(this.libraryFile, JSON.stringify(library, null, 2))
  }

  async addCategoryToEntry(categoryId: string, entryId: string): Promise<void> {
    const library = await this.getLibrary()

    const category = library.categories.find((cat) => cat.id === categoryId)
    const entry = library.entries.find((e) => e.id === entryId)

    if (!category) {
      throw new Error(`Category with ID "${categoryId}" does not exist.`)
    }

    if (!entry) {
      throw new Error(`Library entry with ID "${entryId}" does not exist.`)
    }

    if (entry.category?.includes(categoryId)) {
      throw new Error(`Category "${categoryId}" is already assigned to this entry.`)
    }

    entry.category.push(categoryId)

    await writeFile(this.libraryFile, JSON.stringify(library, null, 2))
  }

  async removeCategoryFromEntry(categoryId: string, entryId: string): Promise<void> {
    const library = await this.getLibrary()

    const entry = library.entries.find((e) => e.id === entryId)

    if (!entry) {
      throw new Error(`Library entry with ID "${entryId}" does not exist.`)
    }

    if (!entry.category?.includes(categoryId)) {
      throw new Error(`Category "${categoryId}" is not assigned to this entry.`)
    }

    entry.category = entry.category.filter((catId) => catId !== categoryId)

    await writeFile(this.libraryFile, JSON.stringify(library, null, 2))
  }
  async reorderCategories(newOrder: string[]): Promise<void> {
    const library = await this.getLibrary()

    const newCategories = newOrder
      .map((id) => library.categories.find((cat) => cat.id === id))
      .filter((cat): cat is NonNullable<typeof cat> => !!cat)

    if (newCategories.length !== library.categories.length) {
      throw new Error('Invalid category order: some categories are missing or unknown.')
    }

    library.categories = newCategories

    await writeFile(this.libraryFile, JSON.stringify(library, null, 2))
  }
  async getEntryId(sourceId: string, mangaId: string): Promise<string | null> {
    const library = await this.getLibrary()
    const entry = library.entries.find((e) => e.sourceId === sourceId && e.mangaId === mangaId)
    return entry ? entry.id : null
  }
}

const libraryService = new LibraryService()

export { libraryService }
