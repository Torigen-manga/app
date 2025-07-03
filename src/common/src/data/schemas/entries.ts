import { integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

const mangaTable = sqliteTable(
  'manga',
  {
    sourceId: text('source_id').notNull(),
    mangaId: text('manga_id').notNull(),
    name: text('name').notNull(),
    cover: text('cover').notNull(),
    description: text('description'),
    url: text('url').notNull(),
    artists: text('artists', { mode: 'json' }).$type<string[]>(),
    authors: text('authors', { mode: 'json' }).$type<string[]>(),
    status: text('source_status', {
      enum: ['ongoing', 'completed', 'hiatus', 'cancelled', 'unknown']
    }).notNull()
  },
  (t) => [primaryKey({ name: 'manga_pk', columns: [t.sourceId, t.mangaId] })]
)

const historyEntryTable = sqliteTable('history_entry', {
  id: text('id').notNull().primaryKey(),
  sourceId: text('source_id').notNull(),
  mangaId: text('manga_id').notNull(),
  chapterId: text('chapter_id').notNull(),
  chapterTitle: text('chapter_title'),
  lastPageRead: integer('last_page_read').default(0).notNull(),
  readAt: integer('read_at', { mode: 'timestamp' }).notNull()
})

const recentReadTable = sqliteTable(
  'recent_read',
  {
    sourceId: text('source_id').notNull(),
    mangaId: text('manga_id').notNull(),
    lastReadChapterId: text('last_read_chapter_id').notNull(),
    lastReadChapterTitle: text('last_read_chapter_title').notNull(),
    lastPageRead: integer('last_page_read').default(0).notNull(),
    lastReadAt: integer('last_read_at', { mode: 'timestamp' }).notNull()
  },
  (t) => [primaryKey({ name: 'recent_read_pk', columns: [t.sourceId, t.mangaId] })]
)

const libraryEntryTable = sqliteTable(
  'library_entry',
  {
    id: text('id').notNull().primaryKey(),
    sourceId: text('source_id').notNull(),
    mangaId: text('manga_id').notNull(),
    addedAt: integer('added_at', { mode: 'timestamp' }).notNull(),
    cachedTotalChapters: integer('cached_total_chapters').notNull().default(0)
  },
  (t) => [unique('library_unique').on(t.mangaId, t.sourceId)]
)

const libraryEntryToCategoryTable = sqliteTable(
  'library_entry_to_category',
  {
    libraryEntryId: text('library_entry_id').notNull(),
    categoryId: text('category_id').notNull()
  },
  (t) => [
    primaryKey({
      name: 'library_category_pk',
      columns: [t.libraryEntryId, t.categoryId]
    })
  ]
)

const categoryTable = sqliteTable('category', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique()
})

type MangaTable = typeof mangaTable.$inferSelect
type HistoryEntryTable = typeof historyEntryTable.$inferSelect
type RecentReadTable = typeof recentReadTable.$inferSelect
type LibraryEntryTable = typeof libraryEntryTable.$inferSelect
type LibraryEntryToCategoryTable = typeof libraryEntryToCategoryTable.$inferSelect
type CategoryTable = typeof categoryTable.$inferSelect

export {
  mangaTable,
  historyEntryTable,
  recentReadTable,
  libraryEntryTable,
  libraryEntryToCategoryTable,
  categoryTable
}

export type {
  MangaTable,
  HistoryEntryTable,
  RecentReadTable,
  LibraryEntryTable,
  LibraryEntryToCategoryTable,
  CategoryTable
}
