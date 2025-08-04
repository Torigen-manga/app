import type { PreferDarkMode, Theme } from "@common/src/types";
import { useCallback, useEffect } from "react";
import { usePreferences } from "./use-preferences";

function resolveThemeClasses(
	theme: Theme,
	preferDarkMode: PreferDarkMode
): string[] {
	type ThemeMap = Record<Theme, Record<"light" | "dark", string[]>>;

	const themeMap: ThemeMap = {
		default: {
			light: [],
			dark: ["dark"],
		},
		strawberryRush: {
			light: ["strawberry-rush"],
			dark: ["strawberry-rush", "strawberry-night"],
		},
		blueberryBreeze: {
			light: ["blueberry-breeze"],
			dark: ["blueberry-breeze", "blueberry-dark"],
		},
	};

	const isSystemDark = window.matchMedia(
		"(prefers-color-scheme: dark)"
	).matches;

	function correctEffectiveMode() {
		if (preferDarkMode === "system") {
			return isSystemDark ? "dark" : "light";
		}
		return preferDarkMode;
	}

	const effectiveMode = correctEffectiveMode();

	return themeMap[theme][effectiveMode];
}

export function useTheme() {
	const { layoutPreferences, loading, isUpdating, updateLayoutPreferences } =
		usePreferences();

	const theme: Theme = (layoutPreferences?.theme as Theme) || "default";
	const preferDarkMode: PreferDarkMode =
		(layoutPreferences?.preferDarkMode as PreferDarkMode) || "system";

	const applyTheme = useCallback(
		(newTheme: Theme, newPreferDarkMode: PreferDarkMode) => {
			const root = document.documentElement;

			root.classList.remove(
				"dark",
				"blueberry-breeze",
				"blueberry-dark",
				"strawberry-rush",
				"strawberry-night"
			);

			const resolvedClasses = resolveThemeClasses(newTheme, newPreferDarkMode);

			for (const className of resolvedClasses) {
				root.classList.add(className);
			}
		},
		[]
	);

	useEffect(() => {
		if (loading || isUpdating) {
			return;
		}
		applyTheme(theme, preferDarkMode);
	}, [theme, preferDarkMode, loading, isUpdating, applyTheme]);

	useEffect(() => {
		if (preferDarkMode !== "system") {
			return;
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			applyTheme(theme, "system");
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme, preferDarkMode, applyTheme]);

	const setTheme = (newTheme: Theme) => {
		updateLayoutPreferences({ theme: newTheme });
	};

	const setPreferDarkMode = (newMode: PreferDarkMode) => {
		updateLayoutPreferences({ preferDarkMode: newMode });
	};

	return {
		theme,
		preferDarkMode,
		setTheme,
		setPreferDarkMode,
		isLoading: loading || isUpdating,
	};
}
