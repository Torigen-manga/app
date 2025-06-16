import { createBrowserRouter, type RouteObject } from 'react-router'
import BaseLayout from './layout/base'
import SettingsLayout from './layout/setting'
import Home from './pages/home'

import LayoutPreferences from './pages/settings/layout'
import ExperimentalPreferences from './pages/settings/experimental'
import ReaderPreferences from './pages/settings/reader'
import SystemBehaviorPreferences from './pages/settings/system-behavior'
import LibraryHistoryPreferences from './pages/settings/library-history'

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
