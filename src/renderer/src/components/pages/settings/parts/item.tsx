import type { ReactNode } from "react";

interface SettingItemProps {
	title: string;
	description?: string;
	children: ReactNode;
}

export function SettingItem({
	title,
	description,
	children,
}: SettingItemProps) {
	return (
		<div className="flex border-border/50 border-b py-2 last:border-0 lg:items-center lg:justify-between">
			<div className="w-fit space-y-1">
				<h3 className="font-medium">{title}</h3>
				{description && (
					<p className="text-muted-foreground text-sm">{description}</p>
				)}
			</div>
			<div className="">{children}</div>
		</div>
	);
}
