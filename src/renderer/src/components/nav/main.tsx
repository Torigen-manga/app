import {
  Compass,
  House,
  LibraryBig,
  type LucideIcon,
  Minus,
  Package,
  Plus,
  Search,
  SlidersHorizontal
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '../ui/sidebar'
import { Link, useLocation } from 'react-router'
import { cn } from '@renderer/lib/utils'

export function NavMain() {
  const { pathname } = useLocation()

  type SidebarSubPath = {
    name: string
    path: string
  }

  type SidebarPath = {
    title: string
    items: {
      name: string
      path?: string
      icon?: LucideIcon
      subpath?: SidebarSubPath[]
    }[]
  }

  const isActive = (linkPath?: string, subpaths?: SidebarSubPath[]): boolean => {
    if (linkPath === '/' && pathname === '/') {
      return true
    }

    if (linkPath === '/explore' && pathname.startsWith('/explore')) {
      return true
    }

    if (linkPath === '/search' && pathname.startsWith('/search')) {
      return true
    }

    if (pathname === '/category' && pathname.startsWith('/category/')) {
      return true
    }

    if (linkPath === '/settings' && pathname.startsWith('/settings')) {
      return true
    }

    if (linkPath === '/extensions' && pathname.startsWith('/extensions')) {
      return true
    }

    if (subpaths?.some((sub) => sub.path === pathname)) return true

    return false
  }

  const navLinks: SidebarPath = {
    title: 'Content',
    items: [
      {
        name: 'Home',
        icon: House,
        path: '/'
      },

      {
        name: 'Search',
        path: '/search',
        icon: Search
      },
      {
        name: 'Explore',
        path: '/explore',
        icon: Compass
      },
      {
        name: 'Extensions',
        path: '/extensions',
        icon: Package
      },
      {
        name: 'Settings',
        path: '/settings',
        icon: SlidersHorizontal
      }
    ]
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navLinks.items.map((item) => {
          const Icon = item.icon || LibraryBig

          if (item.subpath) {
            return (
              <Collapsible defaultOpen className="group/collapsible" key={item.name}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        'mb-2 cursor-pointer',
                        !isActive(item.path, item.subpath) && 'text-muted-foreground',
                        isActive(item.path, item.subpath) &&
                          'bg-primary hover:bg-primary text-white hover:text-white'
                      )}
                    >
                      <Icon className="size-4" />
                      {item.name}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.subpath.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subpath.map((item) => (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton asChild>
                              <Link to={item.path}>{item.name}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="cursor-pointer justify-between">
                            Create Category
                            <Plus />
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            )
          } else {
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  className={cn(
                    'mb-2 cursor-pointer',
                    !isActive(item.path || '') && 'text-muted-foreground',
                    isActive(item.path || '') &&
                      'bg-primary hover:bg-primary text-white hover:text-white'
                  )}
                  asChild
                >
                  <Link to={item.path || ''}>
                    <Icon />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
