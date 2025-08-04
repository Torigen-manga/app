import { historyMethods } from "@renderer/hooks/services/history";
import type { Manga } from "@torigen/mounter";
import { useEffect, useMemo, useState } from "react";

export function useReadingProgress(
	manga: Manga | undefined,
	mangaId: string,
	source: string,
	chapterId: string,
	currentPage: number,
	chapterNumber: number
) {
	const [lastRecordedPage, setLastRecordedPage] = useState(0);
	const useMarkChapterAsRead = historyMethods.MUTATIONS.useMarkChapterAsRead();

	const appManga = useMemo(() => {
		if (!manga) {
			return null;
		}

		return {
			sourceId: source,
			mangaId,
			title: manga.title,
			cover: manga.image,
			description: manga.description,
			artists: manga.artists,
			authors: manga.authors,
			genres: manga.tags.map((tag) => tag.id),
			status: manga.status,
		};
	}, [manga, mangaId, source]);

	useEffect(() => {
		if (currentPage > 1 && currentPage > lastRecordedPage && appManga) {
			useMarkChapterAsRead.mutate({
				data: appManga,
				chapterId,
				chapterNumber,
				pageNumber: currentPage, 
			});
			setLastRecordedPage(currentPage);
		}
	}, [
		currentPage,
		lastRecordedPage,
		useMarkChapterAsRead,
		chapterId,
		chapterNumber,
		appManga,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect runs on chapterId change
	useEffect(() => {
		setLastRecordedPage(0);
	}, [chapterId]);
}
