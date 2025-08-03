import {
  BookOpen,
  FlaskRound,
  LibraryBig,
  type LucideIcon,
  Paintbrush,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";

export type SettingsRoutes =
  | "Layout and Appearance"
  | "Reader Preferences"
  | "Library and History"
  | "System and Behavior"
  | "Experimental Features";

export interface SidebarData {
  name: SettingsRoutes;
  icon: LucideIcon;
}

export function useSidebarData() {
  const [activeRoute, setActiveRoute] = useState<SettingsRoutes>(
    "Layout and Appearance"
  );

  const sidebarData: SidebarData[] = [
    {
      name: "Layout and Appearance",
      icon: Paintbrush,
    },
    {
      name: "Reader Preferences",
      icon: BookOpen,
    },
    {
      name: "Library and History",
      icon: LibraryBig,
    },
    {
      name: "System and Behavior",
      icon: SettingsIcon,
    },
    {
      name: "Experimental Features",
      icon: FlaskRound,
    },
  ];

  return {
    sidebarData,
    activeRoute,
    setActiveRoute,
  };
}
