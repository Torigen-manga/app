import { type AppManga, apiWrapper, channels } from "@common/index";
import { ipcMain } from "electron";
import { historyService } from "./instance";

function createHistoryHandlers() {
	ipcMain.handle(
		channels.history.markAsRead,
		async (
			_,
			data: AppManga,
			chapterId: string,
			chapterNumber: number,
			pageNumber: number
		) =>
			apiWrapper(() =>
				historyService.markChapterAsRead(
					data,
					chapterId,
					chapterNumber,
					pageNumber
				)
			)
	);

	ipcMain.handle(
		channels.history.unmarkAsRead,
		async (_, sourceId: string, mangaId: string, chapterId: string) =>
			apiWrapper(() =>
				historyService.unmarkChapterAsRead(sourceId, mangaId, chapterId)
			)
	);

	ipcMain.handle(
		channels.history.getMangaReadEntry,
		async (_, sourceId: string, mangaId: string) =>
			apiWrapper(() => historyService.getMangaReadEntry(sourceId, mangaId))
	);

	ipcMain.handle(channels.history.getHistoryEntries, async () =>
		apiWrapper(() => historyService.getHistoryEntries())
	);

	ipcMain.handle(channels.history.getReadEntries, async () =>
		apiWrapper(() => historyService.getReadEntries())
	);

	ipcMain.handle(
		channels.history.clearManga,
		async (_, sourceId: string, mangaId: string) =>
			apiWrapper(() => historyService.clearMangaReadEntry(sourceId, mangaId))
	);

	ipcMain.handle(channels.history.clearSource, async (_, sourceId: string) =>
		apiWrapper(() => historyService.clearSourceReadEntries(sourceId))
	);

	ipcMain.handle(channels.history.clearAll, async () =>
		apiWrapper(() => historyService.clearAllReadEntries())
	);
}

export { createHistoryHandlers };
