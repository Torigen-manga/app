export type NavigationMode = "programmatic" | "manual";

export interface UseVerticalReadingOptions {
	debounceMs?: number;
	threshold?: number;
	rootMargin?: string;
}

export interface VerticalNavigationOptions {
	currentPage: number;
	totalPages: number;
	scrollBehavior?: ScrollBehavior;
	isManualScrolling?: boolean;
	markProgrammaticScrollStart?: () => void;
}

export interface VerticalReaderState {
	imageRefs: React.RefObject<(HTMLImageElement | null)[]>;
	loadingStates: boolean[];
	isInitialized: boolean;
	isManualScrolling: boolean;
}

export interface VerticalNavigationActions {
	scrollToPage: (pageNumber: number, mode?: NavigationMode) => void;
	goToFirst: () => void;
	goToLast: () => void;
	goToNext: () => void;
	goToPrevious: () => void;
	goToPage: (pageNumber: number) => void;
}

export interface VerticalReaderHookReturn extends VerticalReaderState {
	handleImageLoad: (index: number) => void;
	setManualScrolling: (isManual: boolean) => void;
	markProgrammaticScrollStart: () => void;
}

export interface VerticalNavigationHookReturn
	extends VerticalNavigationActions {
	containerRef: React.RefObject<HTMLElement>;
}
