export * from "./explore";
export * from "./root";
export * from "./settings";

import { createRouter } from "@tanstack/react-router";
import { exploreLayoutRoute, exploreRoutes } from "./explore";
import { baseRoutes, rootRoute } from "./root";
import { settingsLayoutRoute, settingsRoutes } from "./settings";

const routeTree = rootRoute.addChildren([
	...baseRoutes,
	exploreLayoutRoute.addChildren(exploreRoutes),
	settingsLayoutRoute.addChildren(settingsRoutes),
]);

const router = createRouter({ routeTree });

export { router };
