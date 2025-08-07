import type { PreferDarkMode, Theme } from "@common/index";
import { cn } from "@renderer/lib/utils";

const themePreviewColors = {
	light: {
		default: {
			primary: "oklch(0.596 0.145 163.225)",
			background: "oklch(0.982 0.005 95.099)",
		},
		strawberryRush: {
			primary: "oklch(0.628 0.208 359.001)",
			background: "oklch(0.982 0.01 325.65)",
		},
		blueberryBreeze: {
			primary: "oklch(0.6 0.169 260.439)",
			background: "oklch(0.982 0.01 325.65)",
		},
	},
	dark: {
		default: {
			primary: "oklch(0.596 0.145 163.225)",
			background: "oklch(0.268 0.004 106.643)",
		},
		strawberryRush: {
			primary: "oklch(0.461 0.186 4.072)",
			background: "oklch(0.228 0.02 307.469)",
		},
		blueberryBreeze: {
			primary: "oklch(0.441 0.15 255.895)",
			background: "oklch(22.798% 0.01584 274.075)",
		},
	},
};

const themeLabels = {
	default: "Default (Paper)",
	strawberryRush: "Strawberry Rush",
	blueberryBreeze: "Blueberry Breeze",
};

function ThemePreview({
	theme,
	mode,
	isSelected,
	onClick,
}: {
	theme: Theme;
	mode: PreferDarkMode;
	isSelected: boolean;
	onClick: () => void;
}) {
	const colors =
		themePreviewColors[mode][theme as keyof typeof themePreviewColors.light];

	return (
		<button
			className={cn(
				"flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-2 py-1 transition-all hover:scale-105",
				isSelected ? "border-primary" : "border-border"
			)}
			onClick={onClick}
			type="button"
		>
			<div className="flex h-12 w-16 overflow-hidden rounded">
				<div
					className="h-full w-8"
					style={{ backgroundColor: colors?.background }}
				/>
				<div
					className="h-full w-8"
					style={{ backgroundColor: colors?.primary }}
				/>
			</div>
			<span className="font-medium text-sm">
				{themeLabels[theme as keyof typeof themeLabels]}
			</span>
		</button>
	);
}

export { ThemePreview };
