import type { ChapterEntry } from "@torigen/mounter";
import { useMemo } from "react";

export function useChapterSorting<T extends ChapterEntry>(
	chapters: T[] | undefined
) {
	const sortedChapters = useMemo(() => {
		if (!chapters) {
			return;
		}

		return [...chapters].sort((a, b) => a.number - b.number);
	}, [chapters]);

	return sortedChapters;
}
