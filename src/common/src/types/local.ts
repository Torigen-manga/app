import { Status } from '@torigen/mounter'

type AppManga = {
  sourceId: string
  mangaId: string
  title: string
  cover: string
  description?: string
  url: string
  artists: string[]
  authors: string[]
  status: Status
}

type AppHistoryEntry = {
  id: string
  sourceId: string
  mangaId: string
  chapterId: string
  chapterTitle?: string
  lastPageRead: number
  readAt: Date
}

type AppRecentRead = {
  sourceId: string
  mangaId: string
  lastReadChapterId: string
  lastReadChapterTitle: string
  lastPageRead: number
  lastReadAt: Date
}

type AppLibrary = {
  lastUpdated?: Date
  entries: AppLibraryEntry[]
  categories: Category[]
}

type AppLibraryEntry = {
  id: string
  sourceId: string
  title: string
  cover: string
  mangaId: string
  addedAt: Date
  cachedTotalChapters: number
  category: string[]
}

type Category = {
  id: string
  name: string
}

export type { AppManga, AppHistoryEntry, AppRecentRead, AppLibrary, AppLibraryEntry, Category }
