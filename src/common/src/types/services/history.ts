import type { AppManga } from "../../database";

export interface AppReadEntry {
	sourceId: string;
	mangaId: string;
	readChaptersIds: string[] | null;
	lastReadChapterId: string | null;
	lastReadAt: Date;
}

export interface ReadLog {
	sourceId: string;
	mangaId: string;
	chapterId: string;
	chapterNumber: number;
	pageNumber: number;
	readAt: Date;
}

export interface ReadEntryWithData {
	log: AppReadEntry;
	data: AppManga | null;
}

export interface HistoryEntryWithData {
	log: ReadLog;
	data: AppManga | null;
}
