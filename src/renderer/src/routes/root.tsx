import BaseLayout from "@renderer/layout/base-layout";
import { ErrorPage } from "@renderer/pages/error";
import Extensions from "@renderer/pages/extensions";
import History from "@renderer/pages/history";
import Library from "@renderer/pages/library";
import MangaDetail from "@renderer/pages/manga-details";
import Reader from "@renderer/pages/reader";
import Search from "@renderer/pages/search";
import { createRootRoute, createRoute } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: BaseLayout,
  notFoundComponent: () => <ErrorPage code={404} message="Page Not Found" />,
});

export interface SearchPageSearch {
  query?: string;
  source?: string;
  includedTags?: string[];
  excludedTags?: string[];
  parameters?: Record<string, string | number | boolean | string[]>;
}

export const searchRoute = createRoute({
  path: "/search",
  getParentRoute: () => rootRoute,
  validateSearch: (search: Record<string, unknown>): SearchPageSearch => {
    return {
      query: typeof search.query === "string" ? search.query : "",
      source: typeof search.source === "string" ? search.source : "",
      includedTags: Array.isArray(search.includedTags)
        ? search.includedTags.filter((x): x is string => typeof x === "string")
        : [],
      excludedTags: Array.isArray(search.excludedTags)
        ? search.excludedTags.filter((x): x is string => typeof x === "string")
        : [],
      parameters:
        typeof search.parameters === "object" && search.parameters !== null
          ? (search.parameters as Record<
              string,
              string | number | boolean | string[]
            >)
          : {},
    };
  },
  component: Search,
});

export const extensionsRoute = createRoute({
  path: "/extensions",
  getParentRoute: () => rootRoute,
  component: Extensions,
});

export const historyPage = createRoute({
  path: "/history",
  getParentRoute: () => rootRoute,
  component: History,
});

export const libraryRoute = createRoute({
  path: "/library",
  getParentRoute: () => rootRoute,
  component: Library,
});

export const mangaDetailRoute = createRoute({
  path: "/manga/$source/$mangaId",
  getParentRoute: () => rootRoute,
  component: MangaDetail,
});

export const readerRoute = createRoute({
  path: "/manga/$source/$mangaId/chapter/$chapterId",
  getParentRoute: () => rootRoute,
  component: Reader,
});

export const baseRoutes = [
  searchRoute,
  extensionsRoute,
  historyPage,
  libraryRoute,
  mangaDetailRoute,
  readerRoute,
];
