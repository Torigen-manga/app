import type { PageLayout, ReadingDir, ZoomBehavior } from "@common/index";
import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { useCallback } from "react";

export function useReaderSettings() {
	const { readerDisplayPreferences, updateReaderPreferences } =
		usePreferences();

	const handlePageLayoutChange = useCallback(
		(value: PageLayout) => {
			updateReaderPreferences({ pageLayout: value });
		},
		[updateReaderPreferences]
	);

	const handleZoomBehaviorChange = useCallback(
		(value: ZoomBehavior) => {
			updateReaderPreferences({ zoomBehavior: value });
		},
		[updateReaderPreferences]
	);

	const handleZoomLevelChange = useCallback(
		(value: number) => {
			updateReaderPreferences({ zoomLevel: value });
		},
		[updateReaderPreferences]
	);

	const handleReadingDirectionChange = useCallback(
		(value: ReadingDir) => {
			updateReaderPreferences({ readingDirection: value });
		},
		[updateReaderPreferences]
	);

	const handleRememberZoomChange = useCallback(
		(value: boolean) => {
			updateReaderPreferences({ rememberZoom: value });
		},
		[updateReaderPreferences]
	);

	return {
		readerDisplayPreferences,
		isLoading: !readerDisplayPreferences,
		handlers: {
			handlePageLayoutChange,
			handleZoomBehaviorChange,
			handleZoomLevelChange,
			handleReadingDirectionChange,
			handleRememberZoomChange,
		},
	};
}
