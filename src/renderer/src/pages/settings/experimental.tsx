import { Card, CardContent } from '@renderer/components/ui/card'
import { SettingItem } from '@renderer/components/settings/item'
import { SettingRenderer } from '@renderer/components/settings/renderer'
import { usePreferences } from '@renderer/hooks/preferences/use-preferences'
import { FlaskRound } from 'lucide-react'
import { Alert, AlertDescription } from '@renderer/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function ExperimentalPreferences() {
  const { experimentalPreferences, updateExperimentalPreferences } = usePreferences()

  if (!experimentalPreferences) return <div>Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <FlaskRound />
          Experimental
        </h1>
        <p className="text-muted-foreground mt-2">
          Experimental features that may be unstable or change in future versions.
        </p>
      </div>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These features are experimental and may cause instability. Use at your own risk.
        </AlertDescription>
      </Alert>

      <Card className="p-0">
        <CardContent className="px-4">
          <SettingItem
            title="Enable custom sources"
            description="Allow loading manga from custom source plugins"
          >
            <SettingRenderer
              setting={{
                key: 'enable_custom_sources',
                title: 'Enable custom sources',
                description: 'Allow loading manga from custom source plugins.',
                type: 'switch'
              }}
              value={experimentalPreferences.enableCustomSources}
              onChange={(value) =>
                updateExperimentalPreferences({
                  enableCustomSources: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Enable debug logging"
            description="Show detailed logs for troubleshooting"
          >
            <SettingRenderer
              setting={{
                key: 'enable_debug_logging',
                title: 'Enable debug logging',
                description: 'Show detailed logs for troubleshooting issues.',
                type: 'switch'
              }}
              value={experimentalPreferences.enableDebugLogging}
              onChange={(value) =>
                updateExperimentalPreferences({
                  enableDebugLogging: value
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Use hardware acceleration for images"
            description="GPU acceleration for image rendering (may cause issues)"
          >
            <SettingRenderer
              setting={{
                key: 'hardware_acceleration',
                title: 'Use hardware acceleration for images',
                description:
                  'Use GPU acceleration for image rendering (may cause issues on some systems).',
                type: 'switch'
              }}
              value={experimentalPreferences.hardwareAcceleration}
              onChange={(value) =>
                updateExperimentalPreferences({
                  hardwareAcceleration: value
                })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>
    </div>
  )
}
