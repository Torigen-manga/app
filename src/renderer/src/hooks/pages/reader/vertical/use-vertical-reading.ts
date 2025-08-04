import { useCallback, useEffect, useRef, useState } from "react";

interface UsePageDetectionOptions {
	debounceMs?: number;
	threshold?: number;
	rootMargin?: string;
	disableAutoScrollOnManualNavigation?: boolean;
}

export function useVerticalReading(
	pages: string[] | undefined,
	onPageChange: (page: number) => void,
	options: UsePageDetectionOptions = {}
) {
	const { debounceMs = 150, threshold = 0.3 } = options;

	const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
	const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
	const [hasInitialized, setHasInitialized] = useState(false);
	const [isManualScrolling, setIsManualScrolling] = useState(false);
	const [programmaticScrollInProgress, setProgrammaticScrollInProgress] =
		useState(false);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const currentPageRef = useRef(1);
	const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (pages?.length) {
			imageRefs.current = new Array(pages.length).fill(null);
			setLoadingStates(new Array(pages.length).fill(false));
			setHasInitialized(false);
			currentPageRef.current = 1;
		}
	}, [pages?.length]);

	const debouncedPageChange = useCallback(
		(page: number) => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			debounceTimeoutRef.current = setTimeout(() => {
				if (page !== currentPageRef.current) {
					currentPageRef.current = page;
					onPageChange(page);
				}
			}, debounceMs);
		},
		[onPageChange, debounceMs]
	);

	const handleManualScrolling = useCallback(() => {
		if (programmaticScrollInProgress) {
			return;
		}

		setIsManualScrolling(true);

		if (manualScrollTimeoutRef.current) {
			clearTimeout(manualScrollTimeoutRef.current);
		}

		manualScrollTimeoutRef.current = setTimeout(() => {
			setIsManualScrolling(false);
		}, 500);
	}, [programmaticScrollInProgress]);

	const markProgrammaticScrollStart = useCallback(() => {
		setProgrammaticScrollInProgress(true);
		setTimeout(() => {
			setProgrammaticScrollInProgress(false);
		}, 200);
	}, []);

	useEffect(() => {
		if (!pages?.length) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const visiblePages: number[] = [];

				for (const entry of entries) {
					// biome-ignore lint/nursery/useIndexOf: false alarm
					const index = imageRefs.current.findIndex(
						(img) => img === entry.target
					);

					if (index !== -1 && entry.isIntersecting) {
						visiblePages.push(index + 1);
					}
				}

				if (visiblePages.length === 0) {
					return;
				}

				let targetPage: number;

				if (hasInitialized) {
					visiblePages.sort((a, b) => a - b);
					const currentPage = currentPageRef.current;

					targetPage = visiblePages.reduce((closest, page) => {
						const closestDistance = Math.abs(closest - currentPage);
						const pageDistance = Math.abs(page - currentPage);
						return pageDistance < closestDistance ? page : closest;
					});
				} else {
					targetPage = 1;
					setHasInitialized(true);
				}

				debouncedPageChange(targetPage);
			},
			{ threshold }
		);

		const observeImages = () => {
			const imagesToObserve = imageRefs.current.filter(
				(img): img is HTMLImageElement => img !== null
			);

			if (imagesToObserve.length === 0) {
				return;
			}

			for (const img of imagesToObserve) {
				observer.observe(img);
			}

			if (!hasInitialized) {
				onPageChange(1);
				currentPageRef.current = 1;
				setHasInitialized(true);
			}
		};

		const timeout = setTimeout(observeImages, 100);

		const scrollContainer =
			document.querySelector("[data-scroll-container]") || window;

		scrollContainer.addEventListener("scroll", handleManualScrolling, {
			passive: true,
		});

		return () => {
			clearTimeout(timeout);
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
			if (manualScrollTimeoutRef.current) {
				clearTimeout(manualScrollTimeoutRef.current);
			}
			observer.disconnect();
			scrollContainer.removeEventListener("scroll", handleManualScrolling);
		};
	}, [
		pages?.length,
		threshold,
		hasInitialized,
		debouncedPageChange,
		onPageChange,
		handleManualScrolling,
	]);

	const handleImageLoad = useCallback((index: number) => {
		setLoadingStates((prev) => {
			const newStates = [...prev];
			newStates[index] = true;
			return newStates;
		});
	}, []);

	return {
		imageRefs,
		loadingStates,
		handleImageLoad,
		isInitialized: hasInitialized,
		isManualScrolling,
		setManualScrolling: setIsManualScrolling,
		markProgrammaticScrollStart,
	};
}
