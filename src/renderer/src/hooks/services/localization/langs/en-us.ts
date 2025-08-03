import type { UITexts } from "./types";

const en_lang: UITexts = {
	extensions: {
		title: "Extensions",
	},
	search: {
		title: "Search",
	},
	explore: {
		title: "Explore",
		home: "Home",
	},
	mangaDetails: {
		genres: "Genres",
		authors: "Authors",
		artists: "Artists",
		description: "Description",
		chaptersTable: {
			camps: {
				title: "Chapters",
				releasedSince: "Released Since",
				actions: {
					title: "Actions",
				},
			},
		},
		addToLibrary: {
			title: "Add to Library",
			description: "Add this manga to your library for easy access.",
			addToCategory: {
				checkbox: "Add to a category",
				label: "Category",
				placeholder: "Select or create a category",
				newCategory: {
					label: "New Category",
					placeholder: "Enter new category name",
				},
			},
			options: {
				add: "Add",
				cancel: "Cancel",
			},
		},
		removeFromLibrary: {
			title: "Remove from Library",
			description:
				"Are you sure you want to remove this manga from your library?",
			options: {
				confirm: "Remove",
				cancel: "Cancel",
			},
		},
	},
	sidebar: {
		main: {
			home: "Home",
			search: "Search",
			explore: "Explore",
			library: "Library",
			extensions: "Extensions",
			settings: "Settings",
		},
		explore: {
			title: "Explore",
			home: "Home",
		},
		settings: {
			layout: "Layout",
			reader: "Reader",
			libraryHistory: "Library & History",
			systemBehavior: "System Behavior",
			experimental: "Experimental Features",
		},
	},
	settings: {
		layout: {
			title: "Layout",
			description: "Settings related to the user interface layout.",
			options: {
				themeMode: {
					title: "Theme",
					description: "Choose the theme mode for the interface.",
				},
				appTheme: {
					title: "Colors",
					description: "Choose the colors for the interface.",
				},
				coverStyle: {
					title: "Cover Style",
					description: "Choose the cover style for the interface.",
				},
				showTitles: {
					title: "Show Titles",
					description: "Display manga titles below covers.",
				},
				compactMode: {
					title: "Compact Mode",
					description: "Enable compact mode for a more streamlined interface.",
				},
				showReadIndicator: {
					title: "Read Indicator",
					description: "Display a read chapters indicator in the library.",
				},
			},
		},
		reader: {
			title: "Reader",
			description: "Settings related to the manga reader.",
			options: {
				pageLayout: {
					title: "Page Layout",
					description: "Choose the page layout for reading.",
				},
				zoomBehavior: {
					title: "Zoom Behavior",
					description: "Choose how zoom should behave in the reader.",
				},
				zoomLevel: {
					title: "Zoom Level",
					description: "Set the default zoom level for the reader.",
				},
				readingDirection: {
					title: "Reading Direction",
					description:
						"Choose the reading direction (left to right or right to left).",
				},
				rememberZoom: {
					title: "Remember Zoom",
					description: "Remember zoom level between reading sessions.",
				},
			},
		},
		libraryHistory: {
			title: "Library & History",
			description: "Settings related to the library and reading history.",
			options: {
				enableHistory: {
					title: "Enable History",
					description: "Enable reading history to track progress.",
				},
				maxHistoryEntries: {
					title: "Max History Entries",
					description: "Set the maximum number of entries in reading history.",
				},
				showRecentlyRead: {
					title: "Show Recently Read",
					description: "Display recently read manga in the library.",
				},
			},
		},
		systemBehavior: {
			title: "System Behavior",
			description: "Settings related to system behavior.",
			options: {
				checkNewChaptersOnStartup: {
					title: "Check New Chapters on Startup",
					description:
						"Automatically check for new chapters when starting the app.",
				},
				confirmBeforeRemovingManga: {
					title: "Confirm Before Removing Manga",
					description:
						"Request confirmation before removing a manga from the library.",
				},
				enableNotifications: {
					title: "Enable Notifications",
					description: "Enable notifications for new chapters and updates.",
				},
			},
		},
		experimental: {
			title: "Experimental Features",
			description: "Settings related to experimental features.",
			options: {
				enableCustomSources: {
					title: "Enable Custom Sources",
					description: "Enable adding custom sources for manga.",
				},
				enableDebugLogging: {
					title: "Enable Debug Logging",
					description: "Enable debug logging for troubleshooting.",
				},
				hardwareAcceleration: {
					title: "Hardware Acceleration",
					description: "Enable hardware acceleration for better performance.",
				},
			},
		},
	},
	error: {
		notFound: "Page not found",
		networkError: "Network error",
		unauthorized: "Unauthorized",
		unknownError: "Unknown error",
	},
	library: {
		title: "Library",
		menu: {
			addCategory: {
				menuTitle: "Add Category",
				title: "Add New Category",
				description: "Create a new category to organize your manga.",
			},
			reorder: "Reorder",
		},
		categoryMenu: {
			edit: "Edit",
			delete: "Delete",
		},
		empty: "Your library is empty.",
	},
};

export { en_lang };
