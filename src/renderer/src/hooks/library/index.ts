import { useQuery, useMutation } from '@tanstack/react-query'
import type { AppManga, APIResponse, AppLibrary } from '@common/index'
import { invoke } from '@renderer/lib/ipcMethods'
import { channels } from '@common/index'

const useGetLibrary = () =>
  useQuery({
    queryKey: ['library', 'get-library'],
    queryFn: async () => {
      const res: APIResponse<AppLibrary> = await invoke(channels.library.get)

      if (!res.success) {
        throw new Error(res.error || 'Failed to load library')
      }

      return res.data
    }
  })

const useAddMangaToLibrary = () =>
  useMutation({
    mutationKey: ['library', 'add-entry'],
    mutationFn: async (data: AppManga) => {
      const res: APIResponse<AppManga> = await invoke(channels.library.addEntry, data)
      return res.success
    }
  })

const useRemoveMangaFromLibrary = () =>
  useMutation({
    mutationKey: ['library', 'remove-entry'],
    mutationFn: async (id: string) => {
      const res: APIResponse<void> = await invoke(channels.library.removeEntry, id)
      return res.success
    }
  })

const useAddCategory = () =>
  useMutation({
    mutationKey: ['library', 'add-category'],
    mutationFn: async (category: string) => {
      const res: APIResponse<string> = await invoke(channels.library.addCategory, category)
      return res.success
    }
  })

const useRemoveCategory = () =>
  useMutation({
    mutationKey: ['library', 'remove-category'],
    mutationFn: async (id: string) => {
      const res: APIResponse<void> = await invoke(channels.library.removeCategory, id)
      return res.success
    }
  })

const useReorderCategories = () =>
  useMutation({
    mutationKey: ['library', 'reorder'],
    mutationFn: async (newOrder: string[]) => {
      const res: APIResponse<void> = await invoke(channels.library.reorder, newOrder)
      return res.success
    }
  })

const useAddCategoryToEntry = () =>
  useMutation({
    mutationKey: ['library', 'add-category-to-entry'],
    mutationFn: async (data: { categoryId: string; mangaId: string }) => {
      const res: APIResponse<void> = await invoke(
        channels.library.addCategoryToEntry,
        data.categoryId,
        data.mangaId
      )
      return res.success
    }
  })

const useRemoveCategoryFromEntry = () =>
  useMutation({
    mutationKey: ['library', 'remove-category-from-entry'],
    mutationFn: async (data: { entryId: string; categoryId: string }) => {
      const res: APIResponse<void> = await invoke(
        channels.library.removeCategoryFromEntry,
        data.categoryId,
        data.entryId
      )
      return res.success
    }
  })

const useGetEntryId = (sourceId: string, mangaId: string) =>
  useQuery({
    queryKey: ['library', 'get-entry-id', sourceId, mangaId],
    queryFn: async () => {
      const res: APIResponse<string | null> = await invoke(
        channels.library.getEntryId,
        sourceId,
        mangaId
      )
      if (!res.success) {
        throw new Error(res.error || 'Failed to get entry ID')
      }
      return res.data
    }
  })

export {
  useGetLibrary,
  useAddMangaToLibrary,
  useRemoveMangaFromLibrary,
  useAddCategory,
  useRemoveCategory,
  useReorderCategories,
  useAddCategoryToEntry,
  useRemoveCategoryFromEntry,
  useGetEntryId
}
