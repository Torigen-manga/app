import SettingsLayout from "@renderer/layout/setting-layout";
import ExperimentalPreferences from "@renderer/pages/settings/experimental";
import LayoutPreferences from "@renderer/pages/settings/layout";
import LibraryHistoryPreferences from "@renderer/pages/settings/library-history";
import ReaderPreferences from "@renderer/pages/settings/reader";
import SystemBehaviorPreferences from "@renderer/pages/settings/system-behavior";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";

export const settingsLayoutRoute = createRoute({
	path: "/settings",
	getParentRoute: () => rootRoute,
	component: SettingsLayout,
});

export const layoutSettingsRoute = createRoute({
	path: "/",
	getParentRoute: () => settingsLayoutRoute,
	component: LayoutPreferences,
});

export const experimentalSettingsRoute = createRoute({
	path: "experimental",
	getParentRoute: () => settingsLayoutRoute,
	component: ExperimentalPreferences,
});

export const readerPreferencesRoute = createRoute({
	path: "reader-preferences",
	getParentRoute: () => settingsLayoutRoute,
	component: ReaderPreferences,
});

export const systemBehaviorRoute = createRoute({
	path: "system-behavior",
	getParentRoute: () => settingsLayoutRoute,
	component: SystemBehaviorPreferences,
});

export const libraryHistoryRoute = createRoute({
	path: "library-history",
	getParentRoute: () => settingsLayoutRoute,
	component: LibraryHistoryPreferences,
});

export const settingsRoutes = [
	layoutSettingsRoute,
	experimentalSettingsRoute,
	readerPreferencesRoute,
	systemBehaviorRoute,
	libraryHistoryRoute,
];
