import { cn } from "@renderer/lib/utils";
import { ChevronLeft, ChevronRight, Minus, Square, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function TitleBar() {
	const { state, isMobile } = useSidebar();
	const navigate = useNavigate();

	function handleMinimize(): void {
		window.electron.ipcRenderer.invoke("window:minimize");
	}

	function handleToggleMaximize(): void {
		window.electron.ipcRenderer.invoke("window:maximize");
	}

	function handleClose(): void {
		window.electron.ipcRenderer.invoke("window:close");
	}

	const handleBack = () => {
		navigate(-1);
	};

	const handleForward = () => {
		navigate(1);
	};

	const getLeftOffset = () => {
		if (isMobile) {
			return "0px";
		}

		if (state === "expanded") {
			return "16rem";
		}
		return "3rem";
	};

	const NavigationButtons = () => (
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

	return (
		<header
			className="items-center-2 fixed top-0 right-0 z-50 flex h-8 items-center justify-between bg-sidebar pl-2 transition-[left,width] duration-200 ease-linear"
			style={
				{
					left: getLeftOffset(),
					width: `calc(100% - ${getLeftOffset()})`,
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
				>
					<Square size={14} />
				</button>
				<button
					className="flex size-8 items-center justify-center transition-colors hover:bg-red-400 hover:text-white"
					onClick={handleClose}
					style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
				>
					<X size={16} />
				</button>
			</div>
		</header>
	);
}
