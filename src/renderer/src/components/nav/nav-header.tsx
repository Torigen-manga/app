import { SidebarHeader, useSidebar } from "@renderer/components/ui/sidebar";
import { cn } from "@renderer/lib/utils";

function AppTitle({ abbreviated = false }: { abbreviated?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <h1
        className={cn(
          "font-bold transition-opacity duration-250",
          abbreviated ? "opacity-0" : "opacity-100"
        )}
        title="Torigen"
      >
        Torigen
      </h1>
      <h1
        className={cn(
          "absolute font-bold transition-opacity duration-250",
          abbreviated ? "opacity-100" : "opacity-0"
        )}
        title="TG"
      >
        TG
      </h1>
    </div>
  );
}

export function NavHeader() {
  const { state, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <SidebarHeader className="relative mb-2 flex h-8 flex-row items-center justify-between px-4">
        <AppTitle />
      </SidebarHeader>
    );
  }

  if (state === "expanded") {
    return (
      <SidebarHeader className="relative mb-2 flex h-8 flex-row items-center justify-between px-4 py-0 transition-all duration-200">
        <AppTitle />
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader className="relative mb-2 flex h-8 flex-col items-center justify-center px-2 py-0 transition-all duration-200">
      <AppTitle abbreviated />
    </SidebarHeader>
  );
}
