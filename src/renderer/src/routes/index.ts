export * from "./explore";
export * from "./root";

import { createRouter } from "@tanstack/react-router";
import { exploreLayoutRoute, exploreRoutes } from "./explore";
import { baseRoutes, rootRoute } from "./root";

const routeTree = rootRoute.addChildren([
	...baseRoutes,
	exploreLayoutRoute.addChildren(exploreRoutes),
]);

const router = createRouter({ routeTree });

export { router };
