import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@renderer/components/ui/sidebar";
import { Home, type LucideIcon } from "lucide-react";

type SettingsRoutes =
  | "Layout and Appearance"
  | "Reader Preferences"
  | "Library and History"
  | "System and Behavior"
  | "Experimental Features";

interface SidebarData {
  name: SettingsRoutes;
  icon: LucideIcon;
}

const sidebarData: SidebarData[] = [
  {
    name: "Layout and Appearance",
    icon: Home,
  },
  {
    name: "Reader Preferences",
    icon: Home,
  },
  {
    name: "Library and History",
    icon: Home,
  },
  {
    name: "System and Behavior",
    icon: Home,
  },
  {
    name: "Experimental Features",
    icon: Home,
  },
];

export function SettingsSidebar() {
  return;
}
