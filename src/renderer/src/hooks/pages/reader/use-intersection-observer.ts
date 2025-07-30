import { useEffect, useRef } from "react";

export function useIntersectionObserver(
	pages: string[] | undefined,
	onPageChange: (page: number) => void
) {
	const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

	useEffect(() => {
		if (pages?.length) {
			imageRefs.current = new Array(pages.length).fill(null);
		}
	}, [pages?.length]);

	useEffect(() => {
		if (!pages?.length) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						// biome-ignore lint/nursery/useIndexOf: false positive
						const index = imageRefs.current.findIndex(
							(img) => img === entry.target
						);
						if (index !== -1) {
							onPageChange(index + 1);
						}
					}
				}
			},
			{ threshold: 0.5 }
		);

		const timeout = setTimeout(() => {
			for (const img of imageRefs.current) {
				if (img) {
					observer.observe(img);
				}
			}
		}, 100);

		return () => {
			clearTimeout(timeout);
			for (const img of imageRefs.current) {
				if (img) {
					observer.unobserve(img);
				}
			}
		};
	}, [pages?.length, onPageChange]);

	return imageRefs;
}
