import {
  BookOpen,
  FlaskRound,
  Library,
  Paintbrush,
  SettingsIcon,
  type LucideIcon
} from 'lucide-react'

import { Outlet, useLocation, Link } from 'react-router'
import { cn } from '@renderer/lib/utils'
import React from 'react'

interface SettingNavigation {
  title: string
  href: string
  icon: LucideIcon
}

const settingsNavigation: SettingNavigation[] = [
  {
    title: 'Layout & Appearance',
    href: '/settings/layout-appearance',
    icon: Paintbrush
  },
  {
    title: 'Reader Preferences',
    href: '/settings/reader-preferences',
    icon: BookOpen
  },
  {
    title: 'Library & History',
    href: '/settings/library-history',
    icon: Library
  },
  {
    title: 'System & Behavior',
    href: '/settings/system-behavior',
    icon: SettingsIcon
  },
  {
    title: 'Experimental',
    href: '/settings/experimental',
    icon: FlaskRound
  }
]

function SettingsNav(): React.JSX.Element {
  const location = useLocation()

  return (
    <div className="bg-muted fixed z-10 w-full border-b pt-4 md:static md:w-fit md:border-r md:border-b-0 md:p-4 md:pl-2">
      <div className="inline-flex">
        <h1 className="mb-2 ml-2 text-2xl font-bold">Settings</h1>
      </div>
      <nav className="scrollbar-none flex gap-2 overflow-x-scroll md:flex-col">
        {settingsNavigation.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.href ||
            (location.pathname === '/settings' && item.href === '/settings/layout-appearance')

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'text-muted-foreground flex shrink-0 items-center gap-3 border-b-2 border-transparent px-3 py-2 text-sm font-medium transition-colors md:rounded md:border-none',
                isActive
                  ? 'md:text-primary-foreground text-primary border-primary md:bg-primary'
                  : 'md:hover:bg-primary/40 md:hover:text-primary-foreground'
              )}
            >
              <Icon size={18} />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function SettingsLayout(): React.JSX.Element {
  return (
    <div className="relative flex h-full flex-col rounded-t-lg md:flex-row">
      <SettingsNav />

      <div className="flex-1 overflow-y-auto p-6 pt-28 md:pt-6">
        <Outlet />
      </div>
    </div>
  )
}
