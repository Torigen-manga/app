import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar";
import type { SettingsRoutes, SidebarData } from "./custom-hook";

interface SidebarProps {
  data: SidebarData[];
  currentRoute: SettingsRoutes;
  onRouteChange: (route: SettingsRoutes) => void;
}

export function SettingsSidebar({
  data,
  currentRoute,
  onRouteChange,
}: SidebarProps) {
  return (
    <Sidebar className="hidden md:flex" collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={item.name === currentRoute}
                    onClick={() => onRouteChange(item.name)}
                  >
                    <item.icon />
                    {item.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
