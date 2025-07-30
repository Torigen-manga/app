import type { CoverStyle, PreferDarkMode, Theme } from "@common/index";
import { useCallback } from "react";
import { usePreferences } from "../use-preferences";
import { useTheme } from "../use-theme";

export function useLayoutSettings() {
	const { layoutPreferences, updateLayoutPreferences } = usePreferences();
	const { setTheme, setPreferDarkMode } = useTheme();

	const handlePreferDarkTheme = useCallback(
		(value: PreferDarkMode) => {
			updateLayoutPreferences({ preferDarkMode: value });
			setPreferDarkMode(value);
		},
		[updateLayoutPreferences, setPreferDarkMode]
	);

	const handleChangeTheme = useCallback(
		(value: Theme) => {
			updateLayoutPreferences({ theme: value });
			setTheme(value);
		},
		[updateLayoutPreferences, setTheme]
	);

	const handleGridSizeChange = useCallback(
		(value: string) => {
			updateLayoutPreferences({ gridSize: Number(value) });
		},
		[updateLayoutPreferences]
	);

	const handleCoverStyleChange = useCallback(
		(value: CoverStyle) => {
			updateLayoutPreferences({ coverStyle: value });
		},
		[updateLayoutPreferences]
	);

	const handleShowTitlesChange = useCallback(
		(value: boolean) => {
			updateLayoutPreferences({ showTitles: value });
		},
		[updateLayoutPreferences]
	);

	const handleCompactModeChange = useCallback(
		(value: boolean) => {
			updateLayoutPreferences({ compactMode: value });
		},
		[updateLayoutPreferences]
	);

	const handleReadIndicatorChange = useCallback(
		(value: boolean) => {
			updateLayoutPreferences({ showReadIndicator: value });
		},
		[updateLayoutPreferences]
	);

	return {
		layoutPreferences,
		isLoading: !layoutPreferences,
		handlers: {
			handlePreferDarkTheme,
			handleChangeTheme,
			handleGridSizeChange,
			handleCoverStyleChange,
			handleShowTitlesChange,
			handleCompactModeChange,
			handleReadIndicatorChange,
		},
	};
}
