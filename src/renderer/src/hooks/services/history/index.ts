import {
	type APIResponse,
	type AppManga,
	type AppReadEntry,
	channels,
	type HistoryEntryWithData,
	type ReadEntryWithData,
} from "@common/index";
import { invoke } from "@renderer/lib/ipc-methods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const historyKeys = {
	all: ["history"] as const,
	readEntries: () => [...historyKeys.all, "readEntries"] as const,
	historyEntries: () => [...historyKeys.all, "historyEntries"] as const,
	mangaReadEntry: (sourceId: string, mangaId: string) =>
		[...historyKeys.all, "mangaReadEntry", sourceId, mangaId] as const,
};

function useReadEntries() {
	return useQuery({
		queryKey: historyKeys.readEntries(),
		queryFn: async (): Promise<ReadEntryWithData[]> => {
			const res: APIResponse<ReadEntryWithData[]> = await invoke(
				channels.history.getReadEntries
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to get read entries");
			}

			return res.data;
		},
	});
}

function useHistoryEntries() {
	return useQuery({
		queryKey: historyKeys.historyEntries(),
		queryFn: async (): Promise<HistoryEntryWithData[]> => {
			const res: APIResponse<HistoryEntryWithData[]> = await invoke(
				channels.history.getHistoryEntries
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to get history entries");
			}

			return res.data;
		},
	});
}

function useMangaReadEntry(sourceId: string, mangaId: string) {
	return useQuery({
		queryKey: historyKeys.mangaReadEntry(sourceId, mangaId),
		queryFn: async (): Promise<AppReadEntry | null> => {
			const res: APIResponse<AppReadEntry | null> = await invoke(
				channels.history.getMangaReadEntry,
				sourceId,
				mangaId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to get manga read entry");
			}

			return res.data;
		},
	});
}

function useMarkChapterAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			data,
			chapterId,
			chapterNumber,
			pageNumber,
		}: {
			data: AppManga;
			chapterId: string;
			chapterNumber: number;
			pageNumber: number;
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.history.markAsRead,
				data,
				chapterId,
				chapterNumber,
				pageNumber
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to mark chapter as read");
			}

			return res.data;
		},
		onSuccess: (_, { data }) => {
			queryClient.invalidateQueries({ queryKey: historyKeys.readEntries() });
			queryClient.invalidateQueries({ queryKey: historyKeys.historyEntries() });
			queryClient.invalidateQueries({
				queryKey: historyKeys.mangaReadEntry(data.sourceId, data.mangaId),
			});
		},
		onError: (error) => {
			toast.error(`Failed to mark chapter as read: ${error.message}`);
		},
	});
}

function useUnmarkChapterAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			sourceId,
			mangaId,
			chapterId,
		}: {
			sourceId: string;
			mangaId: string;
			chapterId: string;
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.history.unmarkAsRead,
				sourceId,
				mangaId,
				chapterId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to unmark chapter as read");
			}

			return res.data;
		},
		onSuccess: (_, { sourceId, mangaId }) => {
			queryClient.invalidateQueries({ queryKey: historyKeys.readEntries() });
			queryClient.invalidateQueries({ queryKey: historyKeys.historyEntries() });
			queryClient.invalidateQueries({
				queryKey: historyKeys.mangaReadEntry(sourceId, mangaId),
			});
			toast.success(`Unmarked chapter as read for ${mangaId}`);
		},
		onError: (error) => {
			toast.error(`Failed to clear all read entries: ${error.message}`);
		},
	});
}

function useClearMangaReadEntry() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			sourceId,
			mangaId,
		}: {
			sourceId: string;
			mangaId: string;
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.history.clearManga,
				sourceId,
				mangaId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to clear manga read entry");
			}

			return res.data;
		},
		onSuccess: (_, { sourceId, mangaId }) => {
			queryClient.invalidateQueries({ queryKey: historyKeys.readEntries() });
			queryClient.invalidateQueries({ queryKey: historyKeys.historyEntries() });
			queryClient.invalidateQueries({
				queryKey: historyKeys.mangaReadEntry(sourceId, mangaId),
			});
			toast.success(`Cleared read entry for ${mangaId}`);
		},
		onError: (error) => {
			toast.error(`Failed to clear all read entries: ${error.message}`);
		},
	});
}

function useClearSourceReadEntries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sourceId: string) => {
			const res: APIResponse<void> = await invoke(
				channels.history.clearSource,
				sourceId
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to clear source read entries");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: historyKeys.all });
			queryClient.invalidateQueries({ queryKey: historyKeys.readEntries() });
			toast.success("Cleared all read entries for source");
		},
		onError: (error) => {
			toast.error(`Failed to clear all read entries: ${error.message}`);
		},
	});
}

function useClearAllReadEntries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const res: APIResponse<void> = await invoke(channels.history.clearAll);

			if (!res.success) {
				throw new Error(res.error || "Failed to clear all read entries");
			}

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: historyKeys.all });
			toast.success("Cleared all read entries");
		},
		onError: (error) => {
			toast.error(`Failed to clear all read entries: ${error.message}`);
		},
	});
}

const historyMethods = {
	QUERIES: {
		useHistoryEntries,
		useMangaReadEntry,
		useReadEntries,
	},
	MUTATIONS: {
		useMarkChapterAsRead,
		useUnmarkChapterAsRead,
		useClearMangaReadEntry,
		useClearSourceReadEntries,
		useClearAllReadEntries,
	},
};

export { historyMethods };
