import type { AppManga, AppReadEntry, ReadLog } from "../../database";

export interface ReadEntryWithData {
	log: AppReadEntry;
	data: AppManga | null;
}

export interface HistoryEntryWithData {
	log: ReadLog;
	data: AppManga | null;
}
