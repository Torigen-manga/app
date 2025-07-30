import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { useCallback } from "react";

export function useLibraryHistorySettings() {
	const { libraryHistoryPreferences, updateLibraryHistoryPreferences } =
		usePreferences();

	const handleEnabledChange = useCallback(
		(value: boolean) => {
			updateLibraryHistoryPreferences({ enabled: value });
		},
		[updateLibraryHistoryPreferences]
	);

	const handleMaxEntriesChange = useCallback(
		(value: string) => {
			const numValue = value === "unlimited" ? -1 : Number(value);
			updateLibraryHistoryPreferences({ maxEntries: numValue });
		},
		[updateLibraryHistoryPreferences]
	);

	const handleShowRecentChange = useCallback(
		(value: boolean) => {
			updateLibraryHistoryPreferences({ showRecent: value });
		},
		[updateLibraryHistoryPreferences]
	);

	return {
		libraryHistoryPreferences,
		isLoading: !libraryHistoryPreferences,
		handlers: {
			handleEnabledChange,
			handleMaxEntriesChange,
			handleShowRecentChange,
		},
	};
}
