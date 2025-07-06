import { sqliteTable, text, primaryKey, integer, unique } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { mangaTable } from './app'

const libraryEntryTable = sqliteTable(
  'library_entry',
  {
    id: text('id').notNull().primaryKey(),
    sourceId: text('source_id').notNull(),
    mangaId: text('manga_id').notNull(),
    title: text('title').notNull(),
    cover: text('cover').notNull(),
    addedAt: integer('added_at', { mode: 'timestamp' }).notNull(),
    cachedTotalChapters: integer('cached_total_chapters').notNull().default(0)
  },
  (t) => [unique('library_unique').on(t.mangaId, t.sourceId)]
)

const libraryEntryWithCategoryTable = sqliteTable(
  'library_entry_with_category',
  {
    libraryEntryId: text('library_entry_id')
      .notNull()
      .references(() => libraryEntryTable.id),
    categoryId: text('category_id')
      .notNull()
      .references(() => categoryTable.id)
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

const libraryEntryRelations = relations(libraryEntryTable, ({ one, many }) => ({
  manga: one(mangaTable, {
    fields: [libraryEntryTable.sourceId, libraryEntryTable.mangaId],
    references: [mangaTable.sourceId, mangaTable.mangaId]
  }),

  categories: many(libraryEntryWithCategoryTable)
}))

const categoryRelations = relations(categoryTable, ({ many }) => ({
  libraryEntryToCategories: many(libraryEntryWithCategoryTable)
}))

type LibraryEntryTable = typeof libraryEntryTable.$inferSelect
type LibraryEntryWithCategoryTable = typeof libraryEntryWithCategoryTable.$inferSelect
type CategoryTable = typeof categoryTable.$inferSelect

export {
  libraryEntryTable,
  libraryEntryWithCategoryTable,
  categoryTable,
  libraryEntryRelations,
  categoryRelations
}
export type { LibraryEntryTable, LibraryEntryWithCategoryTable, CategoryTable }
