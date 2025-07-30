import { useEffect } from "react";

export function usePagePreloading(
	pages: string[] | undefined,
	currentPage: number
) {
	useEffect(() => {
		if (!pages || currentPage >= pages.length) {
			return;
		}

		const nextPageUrl = pages[currentPage];
		const preloadImg = new Image();
		preloadImg.src = nextPageUrl;
	}, [currentPage, pages]);
}
