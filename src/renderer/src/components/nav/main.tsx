import { cn } from "@renderer/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Compass,
  History,
  House,
  LibraryBig,
  type LucideIcon,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function NavMain() {
  const { pathname } = useLocation();

  type SidebarPath = {
    title: string;
    items: {
      name: string;
      path: string;
      icon: LucideIcon;
    }[];
  };

  const navLinks: SidebarPath = {
    title: "Content",
    items: [
      {
        name: "Home",
        icon: House,
        path: "/",
      },
      {
        name: "Library",
        icon: LibraryBig,
        path: "/library",
      },
      {
        name: "Search",
        path: "/search",
        icon: Search,
      },
      {
        name: "Explore",
        path: "/explore",
        icon: Compass,
      },
      {
        name: "History",
        path: "/history",
        icon: History,
      },
      {
        name: "Extensions",
        path: "/extensions",
        icon: Package,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: SlidersHorizontal,
      },
    ],
  };

  const isActive = (linkPath: string): boolean =>
    linkPath === "/" ? pathname === "/" : pathname.startsWith(linkPath);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navLinks.items.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "mb-2 cursor-pointer",
                  !isActive(item.path) && "text-muted-foreground",
                  isActive(item.path) &&
                    "bg-primary text-white hover:bg-primary hover:text-white"
                )}
              >
                <Link to={item.path || ""}>
                  <Icon />
                  {item.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
