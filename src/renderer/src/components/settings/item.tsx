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
    <div className="flex flex-col border-border/50 border-b py-4 last:border-0 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div className="mt-2 lg:mt-0">{children}</div>
    </div>
  );
}
