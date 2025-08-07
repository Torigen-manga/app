export interface CategoryRefreshProgress {
	categoryId: string;
	categoryName: string;
	total: number;
	completed: number;
	errors: number;
	isComplete: boolean;
	entries: Array<{
		entryId: string;
		title: string;
		status: "pending" | "updating" | "completed" | "error";
		error?: string;
	}>;
}

export interface LibraryRefreshProgress {
	isRefreshing: boolean;
	overallProgress: {
		completed: number;
		total: number;
		errors: number;
	};
	categories: CategoryRefreshProgress[];
	currentCategory?: string;
}

export interface MangaUpdateResult {
	entryId: string;
	title: string;
	success: boolean;
	error?: string;
	updatedFields?: {
		title?: boolean;
		cover?: boolean;
		chapterCount?: boolean;
	};
}

export interface LibraryEntryWithUnreadCount {
	id: string;
	sourceId: string;
	mangaId: string;
	title: string;
	cover: string;
	addedAt: Date;
	cachedTotalChapters: number;
	readChaptersCount: number;
	unreadCount: number;
	lastRefreshAt?: Date;
	categories?: string[];
}
