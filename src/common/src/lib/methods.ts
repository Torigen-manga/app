

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
  }
}

const events = {}

export { channels, events }
