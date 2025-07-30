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

		const current = chapters.find((ch) => ch.id === currentChapterId);
		const next = chapters.find(
			(ch) => ch.number === (current?.number ?? 0) + 1
		);
		const previous = chapters.find(
			(ch) => ch.number === (current?.number ?? 0) - 1
		);

		return {
			currentChapter: current,
			nextChapter: next,
			previousChapter: previous,
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
