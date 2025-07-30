import { usePreferences } from "./use-preferences";

function useLayout() {
	const { layoutPreferences } = usePreferences();

	const grid = layoutPreferences?.gridSize ?? 6;
	const showTitles = layoutPreferences?.showTitles ?? true;
	const compactMode = layoutPreferences?.compactMode ?? false;
	const showReadIndicator = layoutPreferences?.showReadIndicator ?? true;
	const coverStyle = layoutPreferences?.coverStyle ?? "default";

	return {
		grid,
		showTitles,
		compactMode,
		showReadIndicator,
		coverStyle,
	};
}

export { useLayout };
