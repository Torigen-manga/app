import type { AppHistoryEntry, AppLibrary, AppManga, AppRecentRead } from '@common/src/types'

interface AppMangaServiceInterface {
  getMangaById(sourceId: string, mangaId: string): Promise<AppManga | null>
  addManga(data: AppManga): Promise<AppManga>
}

interface LibraryServiceInterface {
  getLibrary(): Promise<AppLibrary>

  addMangaToLibrary(data: AppManga): Promise<void>
  removeMangaFromLibrary(id: string): Promise<void>

  addCategory(name: string): Promise<void>
  removeCategory(id: string): Promise<void>

  addCategoryToEntry(categoryId: string, entryId: string): Promise<void>
  removeCategoryFromEntry(categoryId: string, entryId: string): Promise<void>
  reorderCategories(newOrder: string[]): Promise<void>

  getEntryId(sourceId: string, mangaId: string): Promise<string | null>
}

interface HistoryServiceInterface {
  getHistoryEntries(): Promise<AppHistoryEntry[]>
  getHistoryEntry(sourceId: string, mangaId: string): Promise<AppHistoryEntry | null>
  addHistoryEntry(data: AppManga): Promise<void>
}

interface RecentReadServiceInterface {
  getRecentReads(): Promise<AppRecentRead[]>
  addRecentRead(data: AppManga): Promise<void>
  clearRecentReads(): Promise<void>
}

export type {
  AppMangaServiceInterface,
  LibraryServiceInterface,
  HistoryServiceInterface,
  RecentReadServiceInterface
}
