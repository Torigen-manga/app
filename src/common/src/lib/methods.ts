const channels = {
	preferences: {
		load: "preferences:load",
		save: "preferences:save",
		reset: "preferences:reset",
	},
	registry: {
		loadAll: "registry:load-all",
		getPath: "registry:get-path",
		getEntry: "registry:get-entry",
		has: "registry:has",
		getStatus: "registry:get-status",
		getAll: "registry:get-all",
		count: "registry:count",
	},
	extension: {
		load: "extension:load",
		homepage: "extension:homepage",
		mangaDetails: "extension:manga-details",
		mangaChapters: "extension:manga-chapters",
		chapterDetails: "extension:chapter-details",
		viewMore: "extension:view-more",
		searchResults: "extension:search-results",
		searchTags: "extension:search-tags",
		info: "extension:info",
		metadata: "extension:metadata",
		capabilities: "extension:capabilities",
	},
	library: {
		get: "library:get",
		clearLibrary: "library:clear-library",
		addEntry: "library:add-entry",
		removeEntry: "library:remove-entry",
		getEntries: "library:get-entries",
		getEntriesByCategory: "library:get-entries-by-category",
		hasEntry: "library:has-entry",
		updateEntryMetadata: "library:update-entry-metadata",
	},
	category: {
		addCategory: "category:add-category",
		rename: "category:rename",
		removeCategory: "category:remove-category",
		addCategoryToEntry: "category:add-category-to-entry",
		removeCategoryFromEntry: "category:remove-category-from-entry",
		reorder: "category:reorder",
	},
};

const events = {};

export { channels, events };
