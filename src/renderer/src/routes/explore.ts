import ExploreLayout from "@renderer/layout/explore-layout";
import Explore from "@renderer/pages/explore/explore";
import ExploreExt from "@renderer/pages/explore/explore-ext";
import ViewMore from "@renderer/pages/explore/explorer-view";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";

export const exploreLayoutRoute = createRoute({
	path: "/explore",
	getParentRoute: () => rootRoute,
	component: ExploreLayout,
});

export const exploreBaseRoute = createRoute({
	path: "/",
	getParentRoute: () => exploreLayoutRoute,
	component: Explore,
});

export const exploreExtensionRoute = createRoute({
	path: "$sourceId",
	getParentRoute: () => exploreLayoutRoute,
	component: ExploreExt,
});

export const exploreViewMoreRoute = createRoute({
	path: "$sourceId/$sectionId",
	getParentRoute: () => exploreLayoutRoute,
	component: ViewMore,
});

export const exploreRoutes = [
	exploreBaseRoute,
	exploreExtensionRoute,
	exploreViewMoreRoute,
];
