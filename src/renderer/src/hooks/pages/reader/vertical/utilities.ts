import type { PageLayout } from "@common/index";

export function isVerticalLayout(pageLayout: PageLayout | undefined): boolean {
	return pageLayout === "vertical-scroll";
}

export function findScrollContainer(
	startElement?: HTMLElement | null
): HTMLElement {
	let element = startElement?.parentElement;

	while (element) {
		const { overflow, overflowY } = window.getComputedStyle(element);
		if (
			overflow === "scroll" ||
			overflow === "auto" ||
			overflowY === "scroll" ||
			overflowY === "auto"
		) {
			return element;
		}
		element = element.parentElement;
	}

	return document.documentElement;
}

export function getCurrentVisiblePage(
	imageRefs: React.RefObject<(HTMLImageElement | null)[]>,
	containerElement?: HTMLElement
): number {
	const container = containerElement || document.documentElement;
	const containerRect = container.getBoundingClientRect();
	const containerCenter = containerRect.top + containerRect.height / 2;

	let closestPage = 1;
	let minDistance = Number.POSITIVE_INFINITY;

	imageRefs.current?.forEach((img, index) => {
		if (!img) {
			return;
		}

		const imgRect = img.getBoundingClientRect();
		const imgCenter = imgRect.top + imgRect.height / 2;
		const distance = Math.abs(imgCenter - containerCenter);

		if (distance < minDistance) {
			minDistance = distance;
			closestPage = index + 1;
		}
	});

	return closestPage;
}

// biome-ignore lint/suspicious/noExplicitAny: for now only
export function createDebounceFunction<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): T & { cancel: () => void } {
	let timeoutId: NodeJS.Timeout | null = null;

	const debouncedFunction = ((...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	}) as T & { cancel: () => void };

	debouncedFunction.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	return debouncedFunction;
}
