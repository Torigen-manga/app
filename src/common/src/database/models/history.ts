import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

const appReadEntryTable = sqliteTable('app_read_entry', {
  sourceId: text('source_id').notNull(),
  mangaId: text('manga_id').notNull(),
  readChaptersIds: text('read_chapters_ids', { mode: 'json' }).$type<string[]>(),
  lastReadChapterId: text('last_read_chapter_id')
})

export { appReadEntryTable }