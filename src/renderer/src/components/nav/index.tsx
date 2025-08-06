import type React from "react";
import { Sidebar, SidebarContent, SidebarRail } from "../ui/sidebar";
import { NavMain } from "./main";

interface SidebarProps {
  onSettingsOpenChange: (value: boolean) => void;
}

export function AppSidebar({
  onSettingsOpenChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & SidebarProps) {
  return (
    <Sidebar
      className="top-(--header-height) border-none"
      collapsible="icon"
      {...props}
    >
      <SidebarContent>
        <NavMain onSettingsOpenChange={onSettingsOpenChange} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
