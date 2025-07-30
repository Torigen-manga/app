import type { AppManga } from "@common/index";
import { libraryMethods } from "@renderer/hooks/services/library";
import type { Manga } from "@torigen/mounter";
import { useMemo } from "react";

export function useMangaLibraryStatus(
	source: string,
	mangaId: string,
	manga: Manga | undefined
) {
	const { data: hasEntry } = libraryMethods.QUERIES.useHasEntry(
		source,
		mangaId
	);

	const appManga: AppManga = useMemo(
		() => ({
			sourceId: source,
			mangaId,
			title: manga?.title || "",
			cover: manga?.image || "",
			description: manga?.description || "",
			artists: manga?.artists || [],
			authors: manga?.authors || [],
			genres: manga?.tags?.map((tag) => tag.id) || [],
			status: manga?.status || "Unknown",
		}),
		[manga, mangaId, source]
	);

	return {
		isInLibrary: hasEntry,
		appManga,
	};
}
