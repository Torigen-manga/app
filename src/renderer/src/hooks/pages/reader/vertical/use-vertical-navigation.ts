import { useCallback, useRef } from "react";
import type { VerticalNavigationOptions } from "./types";

export function useVerticalNavigation(
	imageRefs: React.RefObject<(HTMLImageElement | null)[]>,
	options: VerticalNavigationOptions
) {
	const {
		currentPage,
		totalPages,
		scrollBehavior = "auto",
		isManualScrolling = false,
		markProgrammaticScrollStart,
	} = options;
	const containerRef = useRef<HTMLElement>(null);

	const scrollToPage = useCallback(
		(pageNumber: number, mode: "programmatic" | "manual" = "programmatic") => {
			const targetIndex = pageNumber - 1;
			const targetImage = imageRefs.current?.[targetIndex];
			const container = containerRef.current;

			if (mode === "programmatic" && markProgrammaticScrollStart) {
				markProgrammaticScrollStart();
			}

			if (targetImage && container && !isManualScrolling) {
				const imageRect = targetImage.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();
				const scrollOffset =
					imageRect.top - containerRect.top + container.scrollTop;

				const maxScroll = container.scrollHeight - container.clientHeight;
				const clampedOffset = Math.max(0, Math.min(scrollOffset, maxScroll));
				const finalOffset =
					mode === "programmatic" ? clampedOffset : clampedOffset;

				container.scrollTo({
					top: finalOffset,
					behavior: scrollBehavior,
				});
			} else if (targetImage && !isManualScrolling) {
				targetImage.scrollIntoView({
					behavior: scrollBehavior,
					block: mode === "programmatic" ? "start" : "center",
					inline: "nearest",
				});
			}
		},
		[imageRefs, scrollBehavior, isManualScrolling, markProgrammaticScrollStart]
	);

	const goToFirst = useCallback(() => {
		scrollToPage(1, "programmatic");
	}, [scrollToPage]);

	const goToLast = useCallback(() => {
		scrollToPage(totalPages, "programmatic");
	}, [scrollToPage, totalPages]);

	const goToNext = useCallback(() => {
		const nextPage = Math.min(currentPage + 1, totalPages);
		scrollToPage(nextPage, "programmatic");
	}, [scrollToPage, currentPage, totalPages]);

	const goToPrevious = useCallback(() => {
		const prevPage = Math.max(currentPage - 1, 1);
		scrollToPage(prevPage, "programmatic");
	}, [scrollToPage, currentPage]);

	const goToPage = useCallback(
		(pageNumber: number) => {
			const clampedPage = Math.max(1, Math.min(pageNumber, totalPages));
			scrollToPage(clampedPage, "programmatic");
		},
		[scrollToPage, totalPages]
	);

	return {
		containerRef,
		scrollToPage,
		goToFirst,
		goToLast,
		goToNext,
		goToPrevious,
		goToPage,
	};
}
