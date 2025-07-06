type AppReadStateEntry = {
  sourceId: string
  mangaId: string
  readChapterIds: string[]
  lastReadChapterId?: string
  lastPageRead?: number
  lastReadAt: Date
  progressPercentage?: number
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

type AppReadState = Map<string, AppReadStateEntry>
type AppHistoryState = AppHistoryEntry[]
type AppRecentReadState = AppRecentRead[]

export type {
  AppReadStateEntry,
  AppHistoryEntry,
  AppRecentRead,
  AppReadState,
  AppHistoryState,
  AppRecentReadState
}
