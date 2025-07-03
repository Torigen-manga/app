const channels = {
  preferences: {
    load: 'preferences:load',
    save: 'preferences:save',
    reset: 'preferences:reset'
  },
  extensions: {
    loadAll: 'extensions:load-all',

    getPath: 'extensions:get-path',
    getEntry: 'extensions:get-entry',
    has: 'extensions:has',
    getStatus: 'extensions:get-status',

    getAll: 'extensions:get-all',
    count: 'extensions:count'
  },
  extension: {
    load: 'extension:load',
    homepage: 'extension:homepage',
    mangaDetails: 'extension:mangaDetails',
    mangaChapters: 'extension:mangaChapters',
    searchResults: 'extension:searchResults',
    chapterDetails: 'extension:chapterDetails',
    searchTags: 'extension:searchTags',

    info: 'extension:info',
    metadata: 'extension:metadata',
    capabilities: 'extension:capabilities'
  }
}

const events = {}

export { channels, events }
