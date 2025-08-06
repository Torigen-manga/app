import { AppSidebar } from "@renderer/components/nav";
import { SettingsDialog } from "@renderer/components/pages/settings";
import { TitleBar } from "@renderer/components/titlebar";
import { LoadingPage } from "@renderer/pages/loading";
import { type AnyRouter, Outlet, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

class WindowActions {
  private router: AnyRouter;

  constructor(router: AnyRouter) {
    this.router = router;
  }

  onMinimize() {
    window.electron.ipcRenderer.invoke("window:minimize");
  }

  onToggleMaximize() {
    window.electron.ipcRenderer.invoke("window:maximize");
  }

  onClose() {
    window.electron.ipcRenderer.invoke("window:close");
  }

  onBack() {
    this.router.history.back();
  }

  onForward() {
    this.router.history.forward();
  }

  onRefresh() {
    // There will be a refresh button in the title bar when I implement it;
  }
}

export default function BaseLayout(): React.JSX.Element {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  const windowActions = useMemo(() => new WindowActions(router), [router]);

  const {
    onMinimize,
    onToggleMaximize,
    onClose,
    onBack,
    onForward,
    onRefresh,
  } = windowActions;

  const isLoading = router.state.isLoading;

  return (
    <div className="[--header-height:calc(--spacing(8))]">
      <SidebarProvider className="flex flex-col">
        <TitleBar
          isRefreshing={isLoading}
          onBack={onBack}
          onClose={onClose}
          onForward={onForward}
          onMinimize={onMinimize}
          onRefresh={onRefresh}
          onToggleMaximize={onToggleMaximize}
        />

        <SettingsDialog onOpenChange={setSettingsOpen} open={settingsOpen} />
        <div className="flex flex-1">
          <AppSidebar
            onSettingsOpenChange={setSettingsOpen}
            variant="sidebar"
          />
          <SidebarInset className="relative h-screen w-full bg-sidebar md:pb-10">
            <main className="relative h-full overflow-hidden border bg-background shadow-2xl shadow-black/40 md:rounded-l-lg">
              {isLoading ? <LoadingPage /> : <Outlet />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
