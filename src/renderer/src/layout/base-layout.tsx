import { AppSidebar } from "@renderer/components/nav";
import { SettingsDialog } from "@renderer/components/pages/settings";
import { TitleBar } from "@renderer/components/titlebar";
import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { SidebarProvider } from "../components/ui/sidebar";

export default function BaseLayout(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider className="flex">
      <AppSidebar onOpenChange={setOpen} />
      <SettingsDialog onOpenChange={setOpen} open={open} />

      <div className="relative h-screen w-full overflow-hidden bg-sidebar md:pb-10">
        <TitleBar />
        <main className="relative h-full overflow-hidden border bg-background shadow-2xl shadow-black/40 md:mr-2 md:rounded-lg">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
