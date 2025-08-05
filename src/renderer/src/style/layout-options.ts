import { cva } from "class-variance-authority";

export const coverVariant = cva(
	"group relative h-full overflow-hidden rounded-(--card-radius) bg-sidebar p-(--card-padding) transition-all duration-300 ease-out hover:rounded-(--card-radius) focus:bg-primary/40 focus:outline-none focus:ring-2 focus:ring-primary",
	{
		variants: {
			property: {
				default: "[--card-radius:var(--radius)]",
				shadow: "shadow-lg [--card-radius:var(--radius-lg)] hover:shadow-xl",
				rounded: "[--card-radius:var(--radius-2xl)]",
				border:
					"border border-primary/50 [--card-radius:var(--radius-none)] hover:border-primary",
			},
			showTitles: {
				true: "[--card-padding:--spacing(1)]",
				false: "[--card-padding:--spacing(0.5)]",
			},
		},
		defaultVariants: {
			property: "default",
			showTitles: true,
		},
	}
);
