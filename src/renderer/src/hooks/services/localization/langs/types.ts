type SettingEntry = {
	readonly title: string;
	readonly description?: string;
	readonly values?: readonly string[];
};

export interface UITexts {
	readonly extensions: {
		readonly title: string;
	};

	readonly search: {
		readonly title: string;
	};

	readonly explore: {
		readonly title: string;
		readonly home: string;
	};

	readonly mangaDetails: {
		readonly genres: string;
		readonly authors: string;
		readonly artists: string;
		readonly description: string;

		readonly chaptersTable: {
			readonly camps: {
				readonly title: string;
				readonly releasedSince: string;
				readonly actions: {
					readonly title: string;
				};
			};
		};

		readonly addToLibrary: {
			readonly title: string;
			readonly description: string;

			readonly addToCategory: {
				readonly checkbox: string;
				readonly label: string;
				readonly placeholder: string;
				readonly newCategory: {
					readonly label: string;
					readonly placeholder: string;
				};
			};

			readonly options: {
				readonly add: string;
				readonly cancel: string;
			};
		};

		readonly removeFromLibrary: {
			readonly title: string;
			readonly description: string;
			readonly options: {
				readonly cancel: string;
				readonly confirm: string;
			};
		};
	};

	readonly sidebar: {
		readonly main: {
			readonly home: string;
			readonly library: string;
			readonly search: string;
			readonly explore: string;
			readonly extensions: string;
			readonly settings: string;
		};
		readonly explore: {
			readonly title: string;
			readonly home: string;
		};
		readonly settings: {
			readonly layout: string;
			readonly reader: string;
			readonly libraryHistory: string;
			readonly systemBehavior: string;
			readonly experimental: string;
		};
	};

	readonly settings: {
		readonly layout: {
			readonly title: string;
			readonly description: string;
			readonly options: {
				readonly themeMode: SettingEntry;
				readonly appTheme: SettingEntry;
				readonly coverStyle: SettingEntry;
				readonly showTitles: SettingEntry;
				readonly compactMode: SettingEntry;
				readonly showReadIndicator: SettingEntry;
			};
		};
		readonly reader: {
			readonly title: string;
			readonly description: string;
			readonly options: {
				readonly pageLayout: SettingEntry;
				readonly zoomBehavior: SettingEntry;
				readonly zoomLevel: SettingEntry;
				readonly readingDirection: SettingEntry;
				readonly rememberZoom: SettingEntry;
			};
		};
		readonly libraryHistory: {
			readonly title: string;
			readonly description: string;
			readonly options: {
				readonly enableHistory: SettingEntry;
				readonly maxHistoryEntries: SettingEntry;
				readonly showRecentlyRead: SettingEntry;
			};
		};
		readonly systemBehavior: {
			readonly title: string;
			readonly description: string;
			readonly options: {
				readonly checkNewChaptersOnStartup: SettingEntry;
				readonly confirmBeforeRemovingManga: SettingEntry;
				readonly enableNotifications: SettingEntry;
			};
		};
		readonly experimental: {
			readonly title: string;
			readonly description: string;
			readonly options: {
				readonly enableCustomSources: SettingEntry;
				readonly enableDebugLogging: SettingEntry;
				readonly hardwareAcceleration: SettingEntry;
			};
		};
	};
	readonly error: {
		readonly notFound: string;
		readonly unauthorized: string;
		readonly networkError: string;
		readonly unknownError: string;
	};

	readonly library: {
		readonly title: string;
		readonly menu: {
			readonly addCategory: {
				readonly menuTitle: string;
				readonly title: string;
				readonly description: string;
			};
			readonly reorder: string;
		};
		readonly categoryMenu: {
			readonly edit: string;
			readonly delete: string;
		};
		readonly empty: string;
	};
}

export type Languages = "en-us" | "pt-br";
