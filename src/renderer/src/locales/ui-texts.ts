type SettingEntry = {
	title: string;
	description: string;
	values?: string[];
};

export interface UITexts {
	extensions: {
		title: string;
	};

	search: {
		title: string;
	};

	explore: {
		title: string;
		home: string;
	};

	mangaDetails: {
		genres: string;
		authors: string;
		artists: string;
		description: string;

		chaptersTable: {
			camps: {
				title: string;
				releasedSince: string;
                actions: {
                    title: string;
                }
			};
		};

		addToLibrary: {
			title: string;
			description: string;

			addToCategory: {
				checkbox: string;
				label: string;
				placeholder: string;
				newCategory: {
					label: string;
					placeholder: string;
				};
			};

			options: {
				add: string;
				cancel: string;
			};
		};

		removeFromLibrary: {
			title: string;
			description: string;
			options: {
				cancel: string;
				confirm: string;
			};
		};
	};

	sidebar: {
		main: {
			home: string;
			library: string;
			search: string;
			explore: string;
			extensions: string;
			settings: string;
		};
		explore: {
			title: string;
			home: string;
		};
		settings: {
			layout: string;
			reader: string;
			libraryHistory: string;
			systemBehavior: string;
			experimental: string;
		};
	};

	settings: {
		layout: {
			title: string;
			description: string;
			options: {
				gridSize: SettingEntry;
				themeMode: SettingEntry;
				appTheme: SettingEntry;
				coverStyle: SettingEntry;
				showTitles: SettingEntry;
				compactMode: SettingEntry;
				showReadIndicator: SettingEntry;
			};
		};
		reader: {
			title: string;
			description: string;
			options: {
				pageLayout: SettingEntry;
				zoomBehavior: SettingEntry;
				zoomLevel: SettingEntry;
				readingDirection: SettingEntry;
				rememberZoom: SettingEntry;
			};
		};
		libraryHistory: {
			title: string;
			description: string;
			options: {
				enableHistory: SettingEntry;
				maxHistoryEntries: SettingEntry;
				showRecentlyRead: SettingEntry;
			};
		};
		systemBehavior: {
			title: string;
			description: string;
			options: {
				checkNewChaptersOnStartup: SettingEntry;
				confirmBeforeRemovingManga: SettingEntry;
				enableNotifications: SettingEntry;
			};
		};
		experimental: {
			title: string;
			description: string;
			options: {
				enableCustomSources: SettingEntry;
				enableDebugLogging: SettingEntry;
				hardwareAcceleration: SettingEntry;
			};
		};
	};
	error: {
		notFound: string;
		unauthorized: string;
		networkError: string;
		unknownError: string;
	};
	
	library: {
		title: string;
		menu: {
			addCategory: {
				menuTitle: string;
				title: string;
				description: string;
			};
			reorder: {
				menuTitleActive: string;
				menuTitleInactive: string;
			};
		};
		categoryMenu: {
			edit: string;
			delete: string;
		};
		empty: string;
	};
}
