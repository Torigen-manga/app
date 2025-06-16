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

export default function SettingsLayout() {
  const location = useLocation()

  return (
    <div className="flex h-full">
      {/* Settings Navigation Sidebar */}
      <div className="bg-muted/10 w-64 border-r p-4">
        <div className="inline-flex">
          <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        </div>
        <nav className="space-y-2">
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
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <Icon size={18} />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}
