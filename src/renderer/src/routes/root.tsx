import BaseLayout from "@renderer/layout/base-layout";
import { ErrorPage } from "@renderer/pages/error";
import Extensions from "@renderer/pages/extensions";
import Home from "@renderer/pages/home";
import Library from "@renderer/pages/library";
import MangaDetail from "@renderer/pages/manga-details";
import Reader from "@renderer/pages/reader";
import Search from "@renderer/pages/search";
import { createRootRoute, createRoute } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: BaseLayout,
  notFoundComponent: () => <ErrorPage code={404} message="Page Not Found" />,
});

export const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: Home,
});

export const searchRoute = createRoute({
  path: "/search",
  getParentRoute: () => rootRoute,
  component: Search,
});

export const extensionsRoute = createRoute({
  path: "/extensions",
  getParentRoute: () => rootRoute,
  component: Extensions,
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
  homeRoute,
  searchRoute,
  extensionsRoute,
  libraryRoute,
  mangaDetailRoute,
  readerRoute,
];
