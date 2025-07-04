import { channels, apiWrapper, AppManga } from '@common/index'
import { libraryService } from './instance'
import { ipcMain } from 'electron'

const createLibraryHandlers = () => {
  ipcMain.handle(channels.library.get, async () => apiWrapper(() => libraryService.getLibrary()))
  ipcMain.handle(channels.library.addEntry, async (_, data: AppManga) =>
    apiWrapper(() => libraryService.addMangaToLibrary(data))
  )
  ipcMain.handle(channels.library.removeEntry, async (_, id: string) =>
    apiWrapper(() => libraryService.removeMangaFromLibrary(id))
  )
  ipcMain.handle(
    channels.library.addCategoryToEntry,
    async (_, entryId: string, categoryId: string) =>
      apiWrapper(() => libraryService.addCategoryToEntry(categoryId, entryId))
  )
  ipcMain.handle(
    channels.library.removeCategoryFromEntry,
    async (_, entryId: string, categoryId: string) =>
      apiWrapper(() => libraryService.removeCategoryFromEntry(entryId, categoryId))
  )
  ipcMain.handle(channels.library.addCategory, async (_, category: string) =>
    apiWrapper(() => libraryService.addCategory(category))
  )
  ipcMain.handle(channels.library.removeCategory, async (_, id: string) =>
    apiWrapper(() => libraryService.removeCategory(id))
  )
  ipcMain.handle(channels.library.reorder, async (_, newOrder: string[]) =>
    apiWrapper(() => libraryService.reorderCategories(newOrder))
  )
  ipcMain.handle(channels.library.getEntryId, async (_, sourceId: string, mangaId: string) =>
    apiWrapper(() => libraryService.getEntryId(sourceId, mangaId))
  )
}

export { createLibraryHandlers }
