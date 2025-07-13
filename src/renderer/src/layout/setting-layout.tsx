import { cn } from "@renderer/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  FlaskRound,
  Library,
  type LucideIcon,
  Paintbrush,
  SettingsIcon,
} from "lucide-react";
import type React from "react";

interface SettingNavigation {
  title: string;
  href: string;
  icon: LucideIcon;
}

const settingsNavigation: SettingNavigation[] = [
  {
    title: "Layout & Appearance",
    href: "/settings/layout-appearance",
    icon: Paintbrush,
  },
  {
    title: "Reader Preferences",
    href: "/settings/reader-preferences",
    icon: BookOpen,
  },
  {
    title: "Library & History",
    href: "/settings/library-history",
    icon: Library,
  },
  {
    title: "System & Behavior",
    href: "/settings/system-behavior",
    icon: SettingsIcon,
  },
  {
    title: "Experimental",
    href: "/settings/experimental",
    icon: FlaskRound,
  },
];

function SettingsNav(): React.JSX.Element {
  const { pathname } = useLocation();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed z-10 w-full border-b bg-muted pt-4 md:static md:w-fit md:border-r md:border-b-0 md:p-4 md:pl-2">
      <div className="inline-flex">
        <h1 className="mb-2 ml-2 font-bold text-2xl">Settings</h1>
      </div>
      <nav className="scrollbar-none flex gap-2 overflow-x-scroll md:flex-col">
        {settingsNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex shrink-0 items-center gap-3 border-transparent border-b-2 px-3 py-2 font-medium text-muted-foreground text-sm transition-colors md:rounded md:border-none",
                isActive(item.href)
                  ? "border-primary text-primary md:bg-primary md:text-primary-foreground"
                  : "md:hover:bg-primary/40 md:hover:text-primary-foreground"
              )}
              key={item.href}
              to={item.href}
            >
              <Icon className="size-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function SettingsLayout(): React.JSX.Element {
  return (
    <div className="relative flex h-full flex-col rounded-t-lg md:flex-row">
      <SettingsNav />

      <div className="flex-1 overflow-y-auto p-6 pt-28 md:pt-6">
        <Outlet />
      </div>
    </div>
  );
}
