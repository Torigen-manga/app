import type React from "react";
import { Sidebar, SidebarContent } from "../ui/sidebar";
import { NavMain } from "./main";
import { NavHeader } from "./nav-header";

interface SidebarProps {
  onOpenChange: (value: boolean) => void;
}

export function AppSidebar({
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & SidebarProps) {
  return (
    <Sidebar className="border-none" collapsible="icon" {...props}>
      <NavHeader />
      <SidebarContent>
        <NavMain onOpenChange={onOpenChange} />
      </SidebarContent>
    </Sidebar>
  );
}
