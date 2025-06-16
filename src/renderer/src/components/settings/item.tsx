import { ReactNode } from 'react'

interface SettingItemProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingItem({ title, description, children }: SettingItemProps) {
  return (
    <div className="border-border/50 flex items-center justify-between border-b py-4 last:border-0">
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  )
}
