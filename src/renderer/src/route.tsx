import { createBrowserRouter, type RouteObject } from 'react-router'
import BaseLayout from './layout/base'
import SettingsLayout from './layout/setting'
import Home from './pages/home'
import MangaDetail from './pages/manga-details'
import Explore from './pages/explore/explore'
import ExploreExt from './pages/explore/explore-ext'
import Search from './pages/search'
import Extensions from './pages/extensions'
import Library from './pages/library'

import LayoutPreferences from './pages/settings/layout'
import ExperimentalPreferences from './pages/settings/experimental'
import ReaderPreferences from './pages/settings/reader'
import SystemBehaviorPreferences from './pages/settings/system-behavior'
import LibraryHistoryPreferences from './pages/settings/library-history'
import { ErrorPage } from './pages/error'
import Reader from './pages/reader'

const settingsRoutes: RouteObject[] = [
  {
    index: true,
    element: <LayoutPreferences />
  },
  {
    path: 'layout-appearance',
    element: <LayoutPreferences />
  },
  {
    path: 'experimental',
    element: <ExperimentalPreferences />
  },
  {
    path: 'reader-preferences',
    element: <ReaderPreferences />
  },
  {
    path: 'system-behavior',
    element: <SystemBehaviorPreferences />
  },
  {
    path: 'library-history',
    element: <LibraryHistoryPreferences />
  }
]

const mainRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: '/settings',
    element: <SettingsLayout />,
    children: settingsRoutes
  },
  {
    path: '/explore',
    element: <Explore />
  },
  {
    path: '/explore/:id',
    element: <ExploreExt />
  },
  {
    path: '/search',
    element: <Search />
  },
  {
    path: '/extensions',
    element: <Extensions />
  },
  {
    path: '/library',
    element: <Library />
  },
  {
    path: '/manga/:source/:mangaId',
    element: <MangaDetail />
  },
  {
    path: '/manga/:source/:mangaId/chapter/:chapterId',
    element: <Reader />
  },
  {
    path: '*',
    element: <ErrorPage code={404} message="Page Not Found" />
  }
]

const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: mainRoutes
  }
])

export { appRoutes }
