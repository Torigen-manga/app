import { relations } from 'drizzle-orm'
import {
  categoryTable,
  historyEntryTable,
  libraryEntryTable,
  libraryEntryToCategoryTable,
  mangaTable,
  recentReadTable
} from './entries'

const mangaRelations = relations(mangaTable, ({ many, one }) => ({
  historyEntries: many(historyEntryTable),
  recentRead: one(recentReadTable, {
    fields: [mangaTable.sourceId, mangaTable.mangaId],
    references: [recentReadTable.sourceId, recentReadTable.mangaId]
  }),

  libraryEntry: one(libraryEntryTable, {
    fields: [mangaTable.sourceId, mangaTable.mangaId],
    references: [libraryEntryTable.sourceId, libraryEntryTable.mangaId]
  })
}))

const historyEntryRelations = relations(historyEntryTable, ({ one }) => ({
  manga: one(mangaTable, {
    fields: [historyEntryTable.sourceId, historyEntryTable.mangaId],
    references: [mangaTable.sourceId, mangaTable.mangaId]
  })
}))

const recentReadRelations = relations(recentReadTable, ({ one }) => ({
  manga: one(mangaTable, {
    fields: [recentReadTable.sourceId, recentReadTable.mangaId],
    references: [mangaTable.sourceId, mangaTable.mangaId]
  })
}))

const libraryEntryRelations = relations(libraryEntryTable, ({ one, many }) => ({
  manga: one(mangaTable, {
    fields: [libraryEntryTable.sourceId, libraryEntryTable.mangaId],
    references: [mangaTable.sourceId, mangaTable.mangaId]
  }),

  categories: many(libraryEntryToCategoryTable)
}))

const categoryRelations = relations(categoryTable, ({ many }) => ({
  libraryEntryToCategories: many(libraryEntryToCategoryTable)
}))

const libraryEntryToCategoryRelations = relations(libraryEntryToCategoryTable, ({ one }) => ({
  libraryEntry: one(libraryEntryTable, {
    fields: [libraryEntryToCategoryTable.libraryEntryId],
    references: [libraryEntryTable.id]
  }),
  category: one(categoryTable, {
    fields: [libraryEntryToCategoryTable.categoryId],
    references: [categoryTable.id]
  })
}))

export {
  mangaRelations,
  historyEntryRelations,
  recentReadRelations,
  libraryEntryRelations,
  categoryRelations,
  libraryEntryToCategoryRelations
}
