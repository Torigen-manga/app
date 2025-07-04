const channels = {
  preferences: {
    load: 'preferences:load',
    save: 'preferences:save',
    reset: 'preferences:reset'
  },
  registry: {
    loadAll: 'registry:load-all',
    getPath: 'registry:get-path',
    getEntry: 'registry:get-entry',
    has: 'registry:has',
    getStatus: 'registry:get-status',
    getAll: 'registry:get-all',
    count: 'registry:count'
  },
  extension: {
    load: 'extension:load',
    homepage: 'extension:homepage',
    mangaDetails: 'extension:manga-details',
    mangaChapters: 'extension:manga-chapters',
    searchResults: 'extension:search-results',
    chapterDetails: 'extension:chapter-details',
    searchTags: 'extension:search-tags',

    info: 'extension:info',
    metadata: 'extension:metadata',
    capabilities: 'extension:capabilities'
  },
  library: {
    get: 'library:get',
    addEntry: 'library:add-entry',
    removeEntry: 'library:remove-entry',
    addCategoryToEntry: 'library:add-category-to-entry',
    removeCategoryFromEntry: 'library:remove-category-from-entry',
    addCategory: 'library:add-category',
    removeCategory: 'library:remove-category',
    reorder: 'library:reorder',
    getEntryId: 'library:get-entry-id'
  }
}

const events = {}

export { channels, events }
