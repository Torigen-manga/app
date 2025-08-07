import {
	type APIResponse,
	type AppManga,
	channels,
	type HistoryEntryWithData,
	type ReadEntryWithData,
	type ReadLogReturnal,
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
		queryFn: async (): Promise<ReadLogReturnal[]> => {
			const res: APIResponse<ReadLogReturnal[]> = await invoke(
				channels.history.getMangaReadLogs,
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
			isComplete,
		}: {
			data: AppManga;
			chapterId: string;
			chapterNumber: number;
			pageNumber: number;
			isComplete?: boolean;
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.history.markAsRead,
				data,
				chapterId,
				chapterNumber,
				pageNumber,
				isComplete
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

function useBulkMarkChaptersAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			data,
			chapters,
		}: {
			data: AppManga;
			chapters: Array<{ chapterId: string; chapterNumber: number }>;
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.history.bulkMarkAsRead,
				data,
				chapters
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to bulk mark chapters as read");
			}

			return res.data;
		},
		onSuccess: (_, { data }) => {
			queryClient.invalidateQueries({ queryKey: historyKeys.readEntries() });
			queryClient.invalidateQueries({ queryKey: historyKeys.historyEntries() });
			queryClient.invalidateQueries({
				queryKey: historyKeys.mangaReadEntry(data.sourceId, data.mangaId),
			});
			toast.success("Marked chapters as read");
		},
		onError: (error) => {
			toast.error(`Failed to mark chapters as read: ${error.message}`);
		},
	});
}

function useBulkUnmarkChaptersAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			sourceId,
			mangaId,
			chapterIds,
		}: {
			sourceId: string;
			mangaId: string;
			chapterIds: string[];
		}) => {
			const res: APIResponse<void> = await invoke(
				channels.history.bulkUnmarkAsRead,
				sourceId,
				mangaId,
				chapterIds
			);

			if (!res.success) {
				throw new Error(res.error || "Failed to bulk unmark chapters as read");
			}

			return res.data;
		},
		onSuccess: (_, { sourceId, mangaId }) => {
			queryClient.invalidateQueries({ queryKey: historyKeys.readEntries() });
			queryClient.invalidateQueries({ queryKey: historyKeys.historyEntries() });
			queryClient.invalidateQueries({
				queryKey: historyKeys.mangaReadEntry(sourceId, mangaId),
			});
			toast.success("Unmarked chapters as read");
		},
		onError: (error) => {
			toast.error(`Failed to unmark chapters as read: ${error.message}`);
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
		useBulkMarkChaptersAsRead,
		useBulkUnmarkChaptersAsRead,
		useClearMangaReadEntry,
		useClearSourceReadEntries,
		useClearAllReadEntries,
	},
};

export { historyMethods };
