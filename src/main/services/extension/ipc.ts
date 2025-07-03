import { ipcMain } from 'electron'
import { extensionService, extensionsService } from '.'
import { apiWrapper, channels } from '@common/index'

const createExtensionsHandlers = () => {
  ipcMain.handle(channels.extensions.loadAll, async () =>
    apiWrapper(() => extensionsService.loadExtensions())
  )

  ipcMain.handle(channels.extensions.has, async (_, id: string) =>
    apiWrapper(() => extensionsService.hasExtension(id))
  )

  ipcMain.handle(channels.extensions.getPath, async (_, id: string) =>
    apiWrapper(() => extensionsService.getExtensionPath(id))
  )

  ipcMain.handle(channels.extensions.count, async () =>
    apiWrapper(() => extensionsService.loadExtensions().then((exts) => exts.length))
  )

  ipcMain.handle(channels.extensions.getEntry, (_, id: string) =>
    apiWrapper(() => extensionsService.getExtensionEntry(id))
  )
}

const createExtensionHandlers = () => {
  ipcMain.handle(channels.extension.info, async (_, id: string) =>
    apiWrapper(() => extensionService.getExtensionInfo(id))
  )

  ipcMain.handle(channels.extension.homepage, async (_, id: string) =>
    apiWrapper(() => extensionService.getHomepage(id))
  )
  ipcMain.handle(channels.extension.mangaDetails, async (_, id: string, mangaId: string) =>
    apiWrapper(() => extensionService.getMangaDetails(id, mangaId))
  )

  ipcMain.handle(channels.extension.mangaChapters, async (_, id: string, mangaId: string) =>
    apiWrapper(() => extensionService.getMangaChapters(id, mangaId))
  )

  ipcMain.handle(
    channels.extension.chapterDetails,
    async (_, id: string, mangaId: string, chapterId: string) =>
      apiWrapper(() => extensionService.getChapterDetails(id, mangaId, chapterId))
  )
}

export { createExtensionsHandlers, createExtensionHandlers }
