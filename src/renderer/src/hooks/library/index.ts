import type {
	APIResponse,
	AppLibrary,
	AppManga,
	LibraryEntryTable,
} from "@common/index";
import { channels } from "@common/index";
import { invoke } from "@renderer/lib/ipcMethods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Queries

const useGetLibrary = () =>
	useQuery({
		queryKey: ["library", "get-library"],
		queryFn: async () => {
			const res: APIResponse<AppLibrary> = await invoke(channels.library.get);

			if (!res.success) {
				throw new Error(res.error || "Failed to load library");
			}

			return res.data;
		},
	});

const useGetEntries = () =>
	useQuery({
		queryKey: ["library", "get-entries"],
		queryFn: async () => {
			const res: APIResponse<LibraryEntryTable[]> = await invoke(
				channels.library.getEntries
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to get entries");
			}

			return res.data;
		},
	});

const useGetEntriesByCategory = (categoryId: string) =>
	useQuery({
		queryKey: ["library", "get-entries-by-category", categoryId],
		queryFn: async () => {
			const res: APIResponse<LibraryEntryTable[]> = await invoke(
				channels.library.getEntriesByCategory,
				categoryId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to get entries by category");
			}

			return res.data;
		},
		enabled: !!categoryId,
	});

const useHasEntry = (sourceId: string, mangaId: string) =>
	useQuery({
		queryKey: ["library", "has-entry", sourceId, mangaId],
		queryFn: async () => {
			const res: APIResponse<boolean> = await invoke(
				channels.library.hasEntry,
				sourceId,
				mangaId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to check entry existence");
			}

			return res.data;
		},
		enabled: !!sourceId && !!mangaId,
	});

// Mutations
// These mutations will automatically invalidate the library query to ensure the UI is up-to-date.

function useAddMangaToLibrary() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "add-entry"],
		mutationFn: async (data: AppManga) => {
			const res: APIResponse<void> = await invoke(
				channels.library.addEntry,
				data
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to add manga to library");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useRemoveMangaFromLibrary() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "remove-entry"],
		mutationFn: async (id: string) => {
			const res: APIResponse<void> = await invoke(
				channels.library.removeEntry,
				id
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to remove manga from library");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useClearLibrary() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "clear-library"],
		mutationFn: async () => {
			const res: APIResponse<void> = await invoke(
				channels.library.clearLibrary
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to clear library");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useUpdateMangaMetadata() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "update-entry-metadata"],
		mutationFn: async (data: { id: string; updates: Partial<AppManga> }) => {
			const res: APIResponse<void> = await invoke(
				channels.library.updateEntryMetadata,
				data.id,
				data.updates
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to update manga metadata");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

// Category mutations

const useAddCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "add-category"],
		mutationFn: async (category: string) => {
			const res: APIResponse<string> = await invoke(
				channels.category.addCategory,
				category
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to add category");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
};

function useRemoveCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "remove-category"],
		mutationFn: async (id: string) => {
			const res: APIResponse<void> = await invoke(
				channels.category.removeCategory,
				id
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to remove category");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useAddCategoryToEntry() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "add-category-to-entry"],
		mutationFn: async (data: {
			categoryId: string;
			libraryEntryId: string;
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.category.addCategoryToEntry,
				data.categoryId,
				data.libraryEntryId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to add category to entry");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useRemoveCategoryFromEntry() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "remove-category-from-entry"],
		mutationFn: async (data: { entryId: string; categoryId: string }) => {
			const res: APIResponse<void> = await invoke(
				channels.category.removeCategoryFromEntry,
				data.categoryId,
				data.entryId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to remove category from entry");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useReorderCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "reorder-categories"],
		mutationFn: async (newOrder: string[]) => {
			const res: APIResponse<void> = await invoke(
				channels.category.reorder,
				newOrder
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to reorder categories");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

function useRenameCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["library", "rename-category"],
		mutationFn: async (data: { id: string; name: string }) => {
			const res: APIResponse<void> = await invoke(
				channels.category.rename,
				data.id,
				data.name
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to rename category");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export {
	useGetLibrary,
	useGetEntries,
	useGetEntriesByCategory,
	useHasEntry,
	useAddMangaToLibrary,
	useRemoveMangaFromLibrary,
	useClearLibrary,
	useUpdateMangaMetadata,
	useAddCategory,
	useRemoveCategory,
	useAddCategoryToEntry,
	useRemoveCategoryFromEntry,
	useReorderCategories,
	useRenameCategory,
};
