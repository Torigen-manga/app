import { createBrowserRouter, type RouteObject } from 'react-router'
import BaseLayout from './layout/base'
import SettingsLayout from './layout/setting'
import Home from './pages/home'

import LayoutPreferences from './pages/settings/layout'
import ExperimentalPreferences from './pages/settings/experimental'
import ReaderPreferences from './pages/settings/reader'

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
