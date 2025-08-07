import { cn } from "@renderer/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	Minus,
	RotateCcw,
	Square,
	X,
} from "lucide-react";
import { Button } from "./ui/button";

interface NavigationButtonsProps {
	isRefreshing: boolean;
	onBack: () => void;
	onForward: () => void;
	onRefresh: () => void;
}

function NavigationButtons({
	isRefreshing,
	onBack,
	onForward,
	onRefresh,
}: NavigationButtonsProps) {
	return (
		<div className="ml-2 flex items-center gap-1">
			<Button aria-label="Go back" onClick={onBack} size="icon" variant="ghost">
				<ChevronLeft className="size-4" />
			</Button>

			<Button
				aria-label="Go forward"
				onClick={onForward}
				size="icon"
				variant="ghost"
			>
				<ChevronRight className="size-4" />
			</Button>
			<Button
				aria-label="Refresh"
				onClick={onRefresh}
				size="icon"
				variant="ghost"
			>
				<RotateCcw className={cn(isRefreshing && "animate-spin")} />
			</Button>
		</div>
	);
}

interface TitleBarProps {
	isRefreshing: boolean;
	onBack: () => void;
	onForward: () => void;
	onRefresh: () => void;
	onMinimize: () => void;
	onToggleMaximize: () => void;
	onClose: () => void;
}

export function TitleBar({
	isRefreshing,
	onBack,
	onForward,
	onRefresh,
	onMinimize,
	onToggleMaximize,
	onClose,
}: TitleBarProps) {
	return (
		<header
			className="items-center-2 sticky top-0 right-0 z-50 flex h-(--header-height) w-full items-center justify-between bg-sidebar pl-2 transition-[left,width] duration-200 ease-linear"
			style={
				{
					WebkitAppRegion: "drag",
				} as React.CSSProperties
			}
		>
			<div
				className="inline-flex items-center"
				style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
			>
				<h1 className="select-none font-semibold">Torigen</h1>
				<NavigationButtons
					isRefreshing={isRefreshing}
					onBack={onBack}
					onForward={onForward}
					onRefresh={onRefresh}
				/>
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
					onClick={onMinimize}
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
					onClick={onToggleMaximize}
					style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
					type="button"
				>
					<Square size={14} />
				</button>
				<button
					className="flex size-8 items-center justify-center transition-colors hover:bg-red-400 hover:text-white"
					onClick={onClose}
					style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
					type="button"
				>
					<X size={16} />
				</button>
			</div>
		</header>
	);
}
