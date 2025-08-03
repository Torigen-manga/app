import { useNavigate } from "@tanstack/react-router";
import type { ChapterEntry } from "@torigen/mounter";
import { useCallback, useMemo } from "react";

export function useChapterNavigation(
	source: string,
	mangaId: string,
	chapters: ChapterEntry[] | undefined,
	currentChapterId: string
) {
	const navigate = useNavigate();

	const { currentChapter, nextChapter, previousChapter } = useMemo(() => {
		if (!chapters) {
			return { currentChatper: null, nextChapter: null, previousChapter: null };
		}

		const sorted = [...chapters].sort((a, b) => a.number - b.number);

		const currentIndex = sorted.findIndex((ch) => ch.id === currentChapterId);

		if (currentIndex === -1) {
			return { currentChapter: null, nextChapter: null, previousChapter: null };
		}

		return {
			currentChapter: sorted[currentIndex],
			nextChapter: sorted[currentIndex + 1] ?? null,
			previousChapter: sorted[currentIndex - 1] ?? null,
		};
	}, [chapters, currentChapterId]);

	const handlePreviousChapter = useCallback(() => {
		if (!previousChapter) {
			return;
		}
		return navigate({
			to: `/manga/${source}/${mangaId}/chapter/${previousChapter.id}`,
		});
	}, [mangaId, source, previousChapter, navigate]);

	const handleNextChapter = useCallback(() => {
		if (!nextChapter) {
			return;
		}
		return navigate({
			to: `/manga/${source}/${mangaId}/chapter/${nextChapter.id}`,
		});
	}, [mangaId, source, nextChapter, navigate]);

	return {
		currentChapter,
		nextChapter,
		previousChapter,
		handleNextChapter,
		handlePreviousChapter,
	};
}
