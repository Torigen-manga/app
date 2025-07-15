import { apiWrapper, channels } from "@common/index";
import type { SearchRequest } from "@torigen/mounter";
import { ipcMain } from "electron";
import { extensionService } from "./instance";
import { registryService } from "./registry";

const createExtensionsHandlers = () => {
	ipcMain.handle(channels.registry.loadAll, async () =>
		apiWrapper(() => registryService.loadExtensions())
	);

	ipcMain.handle(channels.registry.has, async (_, id: string) =>
		apiWrapper(() => registryService.hasExtension(id))
	);

	ipcMain.handle(channels.registry.getPath, async (_, id: string) =>
		apiWrapper(() => registryService.getExtensionPath(id))
	);

	ipcMain.handle(channels.registry.count, async () =>
		apiWrapper(() =>
			registryService.loadExtensions().then((exts) => exts.length)
		)
	);

	ipcMain.handle(channels.registry.getEntry, (_, id: string) =>
		apiWrapper(() => registryService.getExtensionEntry(id))
	);
};

const createExtensionHandlers = () => {
	ipcMain.handle(channels.extension.info, async (_, id: string) =>
		apiWrapper(() => extensionService.getExtensionInfo(id))
	);

	ipcMain.handle(channels.extension.metadata, async (_, id: string) =>
		apiWrapper(() => extensionService.getSearchMetadata(id))
	);

	ipcMain.handle(channels.extension.homepage, async (_, id: string) =>
		apiWrapper(() => extensionService.getHomepage(id))
	);

	ipcMain.handle(
		channels.extension.searchResults,
		async (_, id: string, query: SearchRequest) =>
			apiWrapper(() => extensionService.getMangaSearch(id, query))
	);

	ipcMain.handle(
		channels.extension.mangaDetails,
		async (_, id: string, mangaId: string) =>
			apiWrapper(() => extensionService.getMangaDetails(id, mangaId))
	);

	ipcMain.handle(
		channels.extension.mangaChapters,
		async (_, id: string, mangaId: string) =>
			apiWrapper(() => extensionService.getMangaChapters(id, mangaId))
	);

	ipcMain.handle(
		channels.extension.chapterDetails,
		async (_, id: string, mangaId: string, chapterId: string) =>
			apiWrapper(() =>
				extensionService.getChapterDetails(id, mangaId, chapterId)
			)
	);

	ipcMain.handle(
		channels.extension.viewMore,
		async (_, id: string, sectionId: string, metadata) =>
			apiWrapper(() => extensionService.getViewMore(id, sectionId, metadata))
	);

	ipcMain.handle(channels.extension.searchTags, async (_, id: string) =>
		apiWrapper(() => extensionService.getTags(id))
	);
};

export { createExtensionsHandlers, createExtensionHandlers };
