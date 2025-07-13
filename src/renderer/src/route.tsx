// import { createBrowserRouter, type RouteObject } from "react-router";

import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import BaseLayout from "./layout/base-layout";
import ExploreLayout from "./layout/explore-layout";
import SettingsLayout from "./layout/setting-layout";
import { ErrorPage } from "./pages/error";
import Explore from "./pages/explore/explore";
import ExploreExt from "./pages/explore/explore-ext";
import ViewMore from "./pages/explore/explorer-view";
import Extensions from "./pages/extensions";
import Home from "./pages/home";
import Library from "./pages/library";
import MangaDetail from "./pages/manga-details";
import Reader from "./pages/reader";
import Search from "./pages/search";
import ExperimentalPreferences from "./pages/settings/experimental";
import LayoutPreferences from "./pages/settings/layout";
import LibraryHistoryPreferences from "./pages/settings/library-history";
import ReaderPreferences from "./pages/settings/reader";
import SystemBehaviorPreferences from "./pages/settings/system-behavior";

const rootRoute = createRootRoute({
  component: () => <BaseLayout />,
  notFoundComponent: () => <ErrorPage code={404} message="Page Not Found" />,
});

const baseRoutes = [
  createRoute({
    path: "/",
    getParentRoute: () => rootRoute,
    component: Home,
  }),
  createRoute({
    path: "/search",
    getParentRoute: () => rootRoute,
    component: Search,
  }),
  createRoute({
    path: "/extensions",
    getParentRoute: () => rootRoute,
    component: Extensions,
  }),
  createRoute({
    path: "/library",
    getParentRoute: () => rootRoute,
    component: Library,
  }),
  createRoute({
    path: "/manga/$source/$mangaId",
    getParentRoute: () => rootRoute,
    component: MangaDetail,
  }),
  createRoute({
    path: "/manga/$source/$mangaId/chapter/$chapterId",
    getParentRoute: () => rootRoute,
    component: Reader,
  }),
];

const exploreLayoutRoute = createRoute({
  path: "/explore",
  getParentRoute: () => rootRoute,
  component: ExploreLayout,
});

const exploreRoutes = [
  createRoute({
    path: "/",
    getParentRoute: () => exploreLayoutRoute,
    component: Explore,
  }),
  createRoute({
    path: "$sourceId",
    getParentRoute: () => exploreLayoutRoute,
    component: ExploreExt,
  }),
  createRoute({
    path: "$sourceId/$sectionId",
    getParentRoute: () => exploreLayoutRoute,
    component: ViewMore,
  }),
];

const settingsLayoutRoute = createRoute({
  path: "/settings",
  getParentRoute: () => rootRoute,
  component: SettingsLayout,
});

const settingsRoutes = [
  createRoute({
    path: "/",
    getParentRoute: () => settingsLayoutRoute,
    component: LayoutPreferences,
  }),
  createRoute({
    path: "layout-appearance",
    getParentRoute: () => settingsLayoutRoute,
    component: LayoutPreferences,
  }),
  createRoute({
    path: "experimental",
    getParentRoute: () => settingsLayoutRoute,
    component: ExperimentalPreferences,
  }),
  createRoute({
    path: "reader-preferences",
    getParentRoute: () => settingsLayoutRoute,
    component: ReaderPreferences,
  }),
  createRoute({
    path: "system-behavior",
    getParentRoute: () => settingsLayoutRoute,
    component: SystemBehaviorPreferences,
  }),
  createRoute({
    path: "library-history",
    getParentRoute: () => settingsLayoutRoute,
    component: LibraryHistoryPreferences,
  }),
];

const routeTree = rootRoute.addChildren([
  ...baseRoutes,
  exploreLayoutRoute.addChildren(exploreRoutes),
  settingsLayoutRoute.addChildren(settingsRoutes),
]);

const router = createRouter({ routeTree });

export { router };
