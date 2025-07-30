import type { PageLayout, ReadingDir } from "@common/index";
import { useEffect } from "react";

interface UseKeyboardNavigationProps {
	pageLayout?: PageLayout;
	readingDirection?: ReadingDir;
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
	onPreviousChapter: () => void;
	onNextChapter: () => void;
	hasNextChapter: boolean;
	hasPreviousChapter: boolean;
}

export function useKeyboardNavigation({
	pageLayout,
	readingDirection = "ltr",
	currentPage,
	totalPages,
	onPrevious,
	onNext,
	onPreviousChapter,
	onNextChapter,
	hasNextChapter,
	hasPreviousChapter,
}: UseKeyboardNavigationProps) {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			const key = event.key;
			const isVertical = pageLayout === "vertical-scroll";

			const goPrev = () => {
				if (currentPage === 1 && hasPreviousChapter) {
					onPreviousChapter();
				} else {
					onPrevious();
				}
			};

			const goNext = () => {
				if (currentPage === totalPages && hasNextChapter) {
					onNextChapter();
				} else {
					onNext();
				}
			};

			const verticalKeys = {
				ArrowUp: goPrev,
				ArrowDown: goNext,
			};

			const horizontalKeys =
				readingDirection === "ltr"
					? {
							ArrowLeft: goPrev,
							ArrowRight: goNext,
						}
					: {
							ArrowRight: goPrev,
							ArrowLeft: goNext,
						};

			const actions = isVertical ? verticalKeys : horizontalKeys;

			if (key in actions) {
				actions[key]();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		pageLayout,
		readingDirection,
		currentPage,
		totalPages,
		onPrevious,
		onNext,
		onPreviousChapter,
		onNextChapter,
		hasNextChapter,
		hasPreviousChapter,
	]);
}
