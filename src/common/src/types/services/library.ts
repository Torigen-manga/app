import type { CategoryTable, LibraryEntryTable } from "@common/src/database";

type AppLibrary = {
	lastUpdated?: Date;
	entries: LibraryEntryTable[];
	categories: CategoryTable[];
};

export type { AppLibrary };
