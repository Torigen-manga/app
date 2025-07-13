import { type APIResponse, channels, type Maybe } from "@common/index";
import { invoke } from "@renderer/lib/ipc-methods";
import { useQuery } from "@tanstack/react-query";
import type {
	Chapter,
	ChapterEntry,
	Manga,
	MangaEntry,
	PagedResults,
	SearchMetadata,
	Section,
	SourceInfo,
} from "@torigen/mounter";

function useSourceInfo(id: Maybe<string>) {
	return useQuery({
		queryKey: ["extension", id, "info"],
		queryFn: async () => {
			const res: APIResponse<SourceInfo> = await invoke(
				channels.extension.info,
				id
			);

			if (!res.success) {
				throw new Error(
					`Failed to load extension info for ${id}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id),
	});
}

function useSearchMetadata(id: Maybe<string>) {
	return useQuery({
		queryKey: ["extension", id, "metadata"],
		queryFn: async () => {
			const res: APIResponse<SearchMetadata> = await invoke(
				channels.extension.metadata,
				id
			);

			if (!res.success) {
				throw new Error(
					`Failed to load extension metadata for ${id}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id),
	});
}

function useHomepage(id: Maybe<string>) {
	return useQuery({
		queryKey: ["extension", id, "homepage"],
		queryFn: async () => {
			const res: APIResponse<Section[]> = await invoke(
				channels.extension.homepage,
				id
			);

			if (!res.success) {
				throw new Error(
					`Failed to load homepage for extension ${id}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id),
	});
}

function useMangaDetails(id: Maybe<string>, mangaId: Maybe<string>) {
	return useQuery({
		queryKey: ["extension", id, "mangaDetails", mangaId],
		queryFn: async () => {
			const res: APIResponse<Manga> = await invoke(
				channels.extension.mangaDetails,
				id,
				mangaId
			);

			if (!res.success) {
				throw new Error(
					`Failed to load manga details for ${mangaId}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id && mangaId),
	});
}

function useViewMore(
	id: Maybe<string>,
	sectionId: Maybe<string>,
	page: Maybe<number>
) {
	return useQuery({
		queryKey: ["extension", id, "viewMore", sectionId, page],
		queryFn: async () => {
			const res: APIResponse<PagedResults<MangaEntry>> = await invoke(
				channels.extension.viewMore,
				id,
				sectionId,
				page
			);

			if (!res.success) {
				throw new Error(
					`Failed to load view more items for ${sectionId}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id && sectionId && page),
	});
}

function useMangaChapters(id: Maybe<string>, mangaId: Maybe<string>) {
	return useQuery({
		queryKey: ["extension", id, "mangaChapters", mangaId],
		queryFn: async () => {
			const res: APIResponse<ChapterEntry[]> = await invoke(
				channels.extension.mangaChapters,
				id,
				mangaId
			);

			if (!res.success) {
				throw new Error(
					`Failed to load manga chapters for ${mangaId}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id && mangaId),
	});
}

function useChapterDetails(
	id: Maybe<string>,
	mangaId: Maybe<string>,
	chapterId: Maybe<string>
) {
	return useQuery({
		queryKey: ["extension", id, "chapterDetails", mangaId, chapterId],
		queryFn: async () => {
			const res: APIResponse<Chapter> = await invoke(
				channels.extension.chapterDetails,
				id,
				mangaId,
				chapterId
			);

			if (!res.success) {
				throw new Error(
					`Failed to load chapter details for ${mangaId}/${chapterId}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: Boolean(id && mangaId && chapterId),
	});
}

const extensionMethods = {
	useSourceInfo,
	useSearchMetadata,

	useHomepage,
	useViewMore,
	useMangaDetails,
	useMangaChapters,
	useChapterDetails,
};

type ExtensionMethods = typeof extensionMethods;

export { extensionMethods, type ExtensionMethods };
