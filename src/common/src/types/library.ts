import { z } from 'zod'

const entrySchema = z.object({
  source: z.string(),
  id: z.string(),
  title: z.string(),
  coverUrl: z.string().url(),
  addedAt: z.date()
})

const entryPointerSchema = z.object({
  source: z.string(),
  id: z.string()
})

const categorySchema = z.object({
  title: z.string(),
  slug: z.string(),
  entries: z.array(entryPointerSchema),
  sortBy: z.string(),
  sortOrder: z.enum(['asc', 'desc']),
  createdAt: z.date()
})

const librarySchema = z.object({
  entries: z.array(entrySchema),
  categories: z.array(categorySchema),
  lastUpdated: z.date()
})

type Entry = z.infer<typeof entrySchema>
type EntryPointer = z.infer<typeof entryPointerSchema>
type Category = z.infer<typeof categorySchema>
type CategoryManifest = Omit<Category, 'entries'>
type Library = z.infer<typeof librarySchema>

export type { Entry, EntryPointer, Category, CategoryManifest, Library }
export { entrySchema, entryPointerSchema, categorySchema, librarySchema }
