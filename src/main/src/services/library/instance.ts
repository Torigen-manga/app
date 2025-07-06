import { unlink } from 'fs/promises'
import { directories } from '../../paths'
import type { AppLibrary, AppManga, LibraryEntryTable } from '@common/index'
import { appMangaService, AppMangaService } from '../core'
import { join } from 'path'
import { categoryTable, libraryEntryTable, libraryEntryWithCategoryTable } from '@common/index'
import { and, eq } from 'drizzle-orm'
import { downloadCover } from './download'
import { db } from '../../db'

class LibraryService {
  readonly appMangaService: AppMangaService

  constructor(appMangaService: AppMangaService) {
    this.appMangaService = appMangaService
  }

  async getLibrary(): Promise<AppLibrary> {
    const entriesRaw = await db.select().from(libraryEntryTable)
    const categories = await db.select().from(categoryTable)
    const entryCategories = await db.select().from(libraryEntryWithCategoryTable)

    const idToCategories = new Map<string, string[]>()

    for (const ec of entryCategories) {
      if (!idToCategories.has(ec.libraryEntryId)) {
        idToCategories.set(ec.libraryEntryId, [])
      }
      idToCategories.get(ec.libraryEntryId)!.push(ec.categoryId)
    }

    const entries: LibraryEntryTable[] = entriesRaw.map((entry) => ({
      ...entry,
      categories: idToCategories.get(entry.id) ?? []
    }))

    return {
      entries,
      categories
    }
  }

  async clearLibrary(): Promise<void> {
    await db.delete(libraryEntryWithCategoryTable)
    await db.delete(libraryEntryTable)
  }

  async addMangaToLibrary(data: AppManga): Promise<void> {
    const { sourceId, mangaId, cover, title } = data
    // Use consistent ID format: sourceId__mangaId
    const id = `${sourceId}__${mangaId}`

    // Check if entry already exists
    const existing = await db
      .select()
      .from(libraryEntryTable)
      .where(eq(libraryEntryTable.id, id))
      .limit(1)
      .then((r) => r[0])

    // If entry already exists, don't add it again
    if (existing) {
      console.log(`Manga ${id} already exists in library`)
      return
    }

    let coverPath: string

    try {
      coverPath = `cover://${await downloadCover(id, cover)}`
    } catch (err) {
      console.warn(`Failed to download cover for ${id}:`, err)
      coverPath = cover
    }

    // Insert the new entry
    await db.insert(libraryEntryTable).values({
      id,
      sourceId,
      mangaId,
      title,
      cover: coverPath,
      addedAt: new Date(),
      cachedTotalChapters: 0
    })

    // Add to AppManga service if not exists
    const manga = await this.appMangaService.getMangaById(sourceId, mangaId)
    if (!manga) {
      await this.appMangaService.addManga(data)
    }
  }

  async removeMangaFromLibrary(id: string): Promise<void> {
    const entry = await db
      .select()
      .from(libraryEntryTable)
      .where(eq(libraryEntryTable.id, id))
      .then((r) => r[0])

    if (!entry) {
      console.warn(`Library entry with ID "${id}" does not exist`)
      return
    }

    // Remove cover file if it exists
    if (entry.cover.startsWith('cover://')) {
      const fileName = entry.cover.replace('cover://', '')
      const filePath = join(directories.coverCacheDir, fileName)
      try {
        await unlink(filePath)
      } catch (err) {
        console.error(`Failed to delete cover file: ${filePath}`, err)
      }
    }

    // Remove category associations first
    await db
      .delete(libraryEntryWithCategoryTable)
      .where(eq(libraryEntryWithCategoryTable.libraryEntryId, id))

    // Then remove the entry
    await db.delete(libraryEntryTable).where(eq(libraryEntryTable.id, id))
  }

  async getEntries(): Promise<LibraryEntryTable[]> {
    const entriesRaw = await db.select().from(libraryEntryTable)
    const entryCategories = await db.select().from(libraryEntryWithCategoryTable)

    const idToCategories = new Map<string, string[]>()

    for (const ec of entryCategories) {
      if (!idToCategories.has(ec.libraryEntryId)) {
        idToCategories.set(ec.libraryEntryId, [])
      }
      idToCategories.get(ec.libraryEntryId)!.push(ec.categoryId)
    }

    return entriesRaw.map((entry) => ({
      ...entry,
      categories: idToCategories.get(entry.id) ?? []
    }))
  }

  async getEntriesByCategory(categoryId: string): Promise<LibraryEntryTable[]> {
    const entries = await db
      .select()
      .from(libraryEntryTable)
      .innerJoin(
        libraryEntryWithCategoryTable,
        eq(libraryEntryTable.id, libraryEntryWithCategoryTable.libraryEntryId)
      )
      .where(eq(libraryEntryWithCategoryTable.categoryId, categoryId))
      .then((r) => r.map((entry) => entry.library_entry))

    // Add category information to each entry
    const entryCategories = await db.select().from(libraryEntryWithCategoryTable)
    const idToCategories = new Map<string, string[]>()

    for (const ec of entryCategories) {
      if (!idToCategories.has(ec.libraryEntryId)) {
        idToCategories.set(ec.libraryEntryId, [])
      }
      idToCategories.get(ec.libraryEntryId)!.push(ec.categoryId)
    }

    return entries.map((entry) => ({
      ...entry,
      categories: idToCategories.get(entry.id) ?? []
    }))
  }

  async hasEntry(sourceId: string, mangaId: string): Promise<boolean> {
    const entry = await db
      .select({ id: libraryEntryTable.id })
      .from(libraryEntryTable)
      .where(and(eq(libraryEntryTable.sourceId, sourceId), eq(libraryEntryTable.mangaId, mangaId)))
      .limit(1)
      .then((r) => r[0])

    return !!entry
  }

  async updateMangaMetadata(id: string, updates: Partial<AppManga>): Promise<void> {
    const updateData: any = {}

    if (updates.title) updateData.title = updates.title
    if (updates.cover) updateData.cover = updates.cover

    if (Object.keys(updateData).length > 0) {
      await db.update(libraryEntryTable).set(updateData).where(eq(libraryEntryTable.id, id))
    }
  }
}

class CategoryService {
  async addCategory(name: string): Promise<string> {
    const existing = await db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.name, name))
      .then((r) => r[0])

    if (existing) {
      throw new Error(`Category "${name}" already exists.`)
    }

    const id = crypto.randomUUID()
    await db.insert(categoryTable).values({ id, name })

    return id
  }

  async removeCategory(id: string): Promise<void> {
    // Remove all category associations first
    await db
      .delete(libraryEntryWithCategoryTable)
      .where(eq(libraryEntryWithCategoryTable.categoryId, id))

    // Then remove the category
    await db.delete(categoryTable).where(eq(categoryTable.id, id))
  }

  async addCategoryToEntry(categoryId: string, libraryEntryId: string): Promise<void> {
    // Check if entry exists
    const entry = await db
      .select()
      .from(libraryEntryTable)
      .where(eq(libraryEntryTable.id, libraryEntryId))
      .then((r) => r[0])

    if (!entry) {
      throw new Error(`Library entry with ID "${libraryEntryId}" does not exist.`)
    }

    // Check if category exists
    const category = await db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.id, categoryId))
      .then((r) => r[0])

    if (!category) {
      throw new Error(`Category with ID "${categoryId}" does not exist.`)
    }

    // Check if association already exists
    const existing = await db
      .select()
      .from(libraryEntryWithCategoryTable)
      .where(
        and(
          eq(libraryEntryWithCategoryTable.libraryEntryId, libraryEntryId),
          eq(libraryEntryWithCategoryTable.categoryId, categoryId)
        )
      )
      .then((r) => r[0])

    if (existing) {
      console.log(`Category "${categoryId}" is already assigned to entry "${libraryEntryId}"`)
      return // Don't throw error, just return silently
    }

    await db.insert(libraryEntryWithCategoryTable).values({
      libraryEntryId,
      categoryId
    })
  }

  async removeCategoryFromEntry(categoryId: string, entryId: string): Promise<void> {
    await db
      .delete(libraryEntryWithCategoryTable)
      .where(
        and(
          eq(libraryEntryWithCategoryTable.categoryId, categoryId),
          eq(libraryEntryWithCategoryTable.libraryEntryId, entryId)
        )
      )
  }
}

const libraryService = new LibraryService(appMangaService)
const categoryService = new CategoryService()

export { libraryService, categoryService }
