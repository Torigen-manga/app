interface Entry {
  source: string
  id: string
  title: string
  coverUrl: string
  addedAt: Date
}

type EntryPointer = {
  source: string
  id: string
}

interface Category {
  title: string
  slug: string
  entries: EntryPointer[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  createdAt: Date
}

type CategoryManifest = Omit<Category, 'entries'>

interface Library {
  categories: Category[]
  entries: Entry[]
}

export type { Entry, EntryPointer, Category, CategoryManifest, Library }
