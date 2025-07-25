import { cn } from "@renderer/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Minus, Square, X } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function NavigationButtons() {
  const router = useRouter();

  const handleBack = () => {
    router.history.back();
  };

  const handleForward = () => {
    router.history.forward();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Go back"
            className="size-8 transition-colors hover:bg-accent/50"
            onClick={handleBack}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          <p>Go back</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Go forward"
            className="size-8 transition-colors hover:bg-accent/50"
            onClick={handleForward}
            size="icon"
            variant="ghost"
          >
            <ChevronRight className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          <p>Go forward</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function TitleBar() {
  function handleMinimize(): void {
    window.electron.ipcRenderer.invoke("window:minimize");
  }

  function handleToggleMaximize(): void {
    window.electron.ipcRenderer.invoke("window:maximize");
  }

  function handleClose(): void {
    window.electron.ipcRenderer.invoke("window:close");
  }

  return (
    <header
      className="items-center-2 sticky top-0 right-0 z-50 flex h-8 w-full items-center justify-between bg-sidebar pl-2 transition-[left,width] duration-200 ease-linear"
      style={
        {
          WebkitAppRegion: "drag",
        } as React.CSSProperties
      }
    >
      <div
        className="inline-flex"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <SidebarTrigger className="size-8" />
        <NavigationButtons />
      </div>

      <div
        className="flex gap-1"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <button
          className={cn(
            "flex size-8 items-center justify-center transition-colors hover:bg-black/10",
            "blueberry-dark:hover:bg-white/10 strawberry-night:hover:bg-white/10 dark:hover:bg-white/10"
          )}
          onClick={handleMinimize}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          type="button"
        >
          <Minus size={14} />
        </button>
        <button
          className={cn(
            "flex size-8 items-center justify-center transition-colors hover:bg-black/10",
            "blueberry-dark:hover:bg-white/10 strawberry-night:hover:bg-white/10 dark:hover:bg-white/10"
          )}
          onClick={handleToggleMaximize}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          type="button"
        >
          <Square size={14} />
        </button>
        <button
          className="flex size-8 items-center justify-center transition-colors hover:bg-red-400 hover:text-white"
          onClick={handleClose}
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          type="button"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
}
