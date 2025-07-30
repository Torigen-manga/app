import {
	type AppManga,
	apiWrapper,
	channels,
	type LibraryEntryTable,
} from "@common/index";
import { ipcMain } from "electron";
import { categoryService, libraryService } from "./instance";

function createLibraryHandlers() {
	ipcMain.handle(channels.library.get, async () =>
		apiWrapper(() => libraryService.getLibrary())
	);
	ipcMain.handle(channels.library.clearLibrary, async () =>
		apiWrapper(() => libraryService.clearLibrary())
	);
	ipcMain.handle(channels.library.addEntry, async (_, data: AppManga) =>
		apiWrapper(() => libraryService.addMangaToLibrary(data))
	);
	ipcMain.handle(channels.library.removeEntry, async (_, id: string) =>
		apiWrapper(() => libraryService.removeMangaFromLibrary(id))
	);
	ipcMain.handle(channels.library.getEntries, async () =>
		apiWrapper<LibraryEntryTable[]>(() => libraryService.getEntries())
	);
	ipcMain.handle(
		channels.library.getEntriesByCategory,
		async (_, categoryId: string) =>
			apiWrapper(() => libraryService.getEntriesByCategory(categoryId))
	);
	ipcMain.handle(
		channels.library.hasEntry,
		async (_, sourceId: string, mangaId: string) =>
			apiWrapper(() => libraryService.hasEntry(sourceId, mangaId))
	);
}

function createCategoryHandlers() {
	ipcMain.handle(channels.category.addCategory, async (_, name: string) =>
		apiWrapper(() => categoryService.addCategory(name))
	);
	ipcMain.handle(channels.category.removeCategory, async (_, id: string) =>
		apiWrapper(() => categoryService.removeCategory(id))
	);
	ipcMain.handle(
		channels.category.addCategoryToEntry,
		async (_, categoryId: string, entryId: string) =>
			apiWrapper(() => categoryService.addCategoryToEntry(categoryId, entryId))
	);
	ipcMain.handle(
		channels.category.removeCategoryFromEntry,
		async (_, categoryId: string, entryId: string) =>
			apiWrapper(() =>
				categoryService.removeCategoryFromEntry(categoryId, entryId)
			)
	);
	ipcMain.handle(channels.category.reorder, async (_, newOrder: string[]) =>
		apiWrapper(() => categoryService.updateCategoryOrder(newOrder))
	);
	ipcMain.handle(
		channels.category.rename,
		async (_, id: string, name: string) =>
			apiWrapper(() => categoryService.renameCategory(id, name))
	);
}

export { createLibraryHandlers, createCategoryHandlers };
