import { cva } from "class-variance-authority";

const coverVariant = cva("transition-all duration-200", {
	variants: {
		property: {
			default: "rounded-lg",
			shadow: "rounded-lg shadow-lg hover:shadow-xl dark:shadow-white/10",
			rounded: "rounded-2xl",
			border: "rounded-lg border-2 border-primary hover:border-primary/80",
		},
	},
	defaultVariants: {
		property: "default",
	},
});

const gridMap = (grid: number): string => {
	const map = {
		4: "grid-cols-4",
		6: "grid-cols-6",
		8: "grid-cols-8",
		10: "grid-cols-10",
		12: "grid-cols-12",
	};

	return map[grid as keyof typeof map] || "grid-cols-4";
};

export { coverVariant, gridMap };
