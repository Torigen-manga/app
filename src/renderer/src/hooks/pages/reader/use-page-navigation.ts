import { useCallback, useEffect, useState } from "react";

export function usePageNavigation(totalPages: number, chapterId: string) {
	const [currentPage, setCurrentPage] = useState<number>(1);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect runs on chapterId change
	useEffect(() => {
		setCurrentPage(1);
	}, [chapterId]);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(Math.max(1, Math.min(page, totalPages)));
		},
		[totalPages]
	);

	const goToFirst = useCallback(() => goToPage(1), [goToPage]);
	const goToLast = useCallback(
		() => goToPage(totalPages),
		[goToPage, totalPages]
	);
	const goToNext = useCallback(
		() => goToPage(currentPage + 1),
		[goToPage, currentPage]
	);
	const goToPrevious = useCallback(
		() => goToPage(currentPage - 1),
		[goToPage, currentPage]
	);

	return {
		currentPage,
		setCurrentPage,
		goToPage,
		goToFirst,
		goToLast,
		goToNext,
		goToPrevious,
	};
}
