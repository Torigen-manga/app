import { Sidebar, SidebarContent } from '../ui/sidebar'
import React from 'react'
import { NavMain } from './main'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-none" collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  )
}
