import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { SidebarProvider } from "../ui/sidebar";
import { useSidebarData } from "./custom-hook";
import { SettingsRender } from "./sections";
import { SettingsSidebar } from "./sidebar";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { sidebarData, setActiveRoute, activeRoute } = useSidebarData();

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Configure your preferences and settings for the application.
        </DialogDescription>
        <SidebarProvider>
          <SettingsSidebar
            currentRoute={activeRoute}
            data={sidebarData}
            onRouteChange={setActiveRoute}
          />
          <main className="relative flex h-[480px] flex-1 flex-col overflow-hidden">
            <div className="sticky w-full px-4 py-2">
              <h1 className="font-bold text-xl">{activeRoute}</h1>
            </div>
            <div className="overflow-y-auto px-6 py-2">
              <SettingsRender currentRoute={activeRoute} />
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
