import { relations } from 'drizzle-orm'
import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { libraryEntryTable } from './library'

const mangaTable = sqliteTable(
  'app_manga',
  {
    sourceId: text('source_id').notNull(),
    mangaId: text('manga_id').notNull(),
    title: text('title').notNull(),
    cover: text('cover').notNull(),
    description: text('description'),
    authors: text('authors', { mode: 'json' }).$type<string[]>(),
    artists: text('artists', { mode: 'json' }).$type<string[]>(),
    genres: text('genres', { mode: 'json' }).$type<string[]>(),
    status: text('status', {
      enum: ['Ongoing', 'Completed', 'Hiatus', 'Cancelled', 'Unknown']
    }).notNull()
  },
  (t) => [primaryKey({ columns: [t.sourceId, t.mangaId] })]
)

type AppManga = typeof mangaTable.$inferSelect

const mangaRelations = relations(mangaTable, ({ one }) => ({
  libraryEntry: one(libraryEntryTable, {
    fields: [mangaTable.sourceId, mangaTable.mangaId],
    references: [libraryEntryTable.sourceId, libraryEntryTable.mangaId]
  })
}))

export { mangaTable, mangaRelations }
export type { AppManga }
