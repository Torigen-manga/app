import { Card, CardContent } from '@renderer/components/ui/card'
import { SettingItem } from '@renderer/components/settings/item'
import { SettingRenderer } from '@renderer/components/settings/renderer'
import { usePreferences } from '@renderer/hooks/preferences/use-preferences'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SystemBehaviorPreferences() {
  const { systemBehaviorPreferences, updateSystemBehaviorPreferences } = usePreferences()

  if (!systemBehaviorPreferences) return <div>Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <SettingsIcon />
          System & Behavior
        </h1>
        <p className="text-muted-foreground mt-2">Configure app behavior and system integration.</p>
      </div>

      <Card className="p-0">
        <CardContent className="px-4">
          <SettingItem
            title="Check for new chapters on startup"
            description="Automatically check for updates when app starts"
          >
            <SettingRenderer
              setting={{
                key: 'check_new_chapters',
                title: 'Check for new chapters on startup',
                description: 'Automatically check for updates when the app starts.',
                type: 'switch'
              }}
              value={systemBehaviorPreferences.updateOnStartup}
              onChange={(value) =>
                updateSystemBehaviorPreferences({
                  updateOnStartup: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Confirm before removing manga"
            description="Show confirmation dialog when removing manga"
          >
            <SettingRenderer
              setting={{
                key: 'confirm_removal',
                title: 'Confirm before removing manga',
                description: 'Show confirmation dialog when removing manga.',
                type: 'switch'
              }}
              value={systemBehaviorPreferences.confirmRemoval}
              onChange={(value) =>
                updateSystemBehaviorPreferences({
                  confirmRemoval: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Enable notifications"
            description="Show system notifications for new chapters"
          >
            <SettingRenderer
              setting={{
                key: 'enable_notifications',
                title: 'Enable notifications',
                description: 'Show system notifications when new chapters are added.',
                type: 'switch'
              }}
              value={systemBehaviorPreferences.enableNotifications}
              onChange={(value) =>
                updateSystemBehaviorPreferences({
                  enableNotifications: value
                })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>
    </div>
  )
}
