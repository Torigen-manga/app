import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { Alert, AlertDescription } from "@renderer/components/ui/alert";
import { Card, CardContent } from "@renderer/components/ui/card";
import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { AlertTriangle, FlaskRound } from "lucide-react";

export default function ExperimentalPreferences() {
  const { experimentalPreferences, updateExperimentalPreferences } =
    usePreferences();

  if (!experimentalPreferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 font-bold text-3xl">
          <FlaskRound />
          Experimental
        </h1>
        <p className="mt-2 text-muted-foreground">
          Experimental features that may be unstable or change in future
          versions.
        </p>
      </div>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These features are experimental and may cause instability. Use at your
          own risk.
        </AlertDescription>
      </Alert>

      <Card className="p-0">
        <CardContent className="px-4">
          <SettingItem
            description="Allow loading manga from custom source plugins"
            title="Enable custom sources"
          >
            <SettingRenderer
              onChange={(value) =>
                updateExperimentalPreferences({
                  enableCustomSources: value,
                })
              }
              setting={{
                key: "enable_custom_sources",
                title: "Enable custom sources",
                description: "Allow loading manga from custom source plugins.",
                type: "switch",
              }}
              value={experimentalPreferences.enableCustomSources}
            />
          </SettingItem>

          <SettingItem
            description="Show detailed logs for troubleshooting"
            title="Enable debug logging"
          >
            <SettingRenderer
              onChange={(value) =>
                updateExperimentalPreferences({
                  enableDebugLogging: value,
                })
              }
              setting={{
                key: "enable_debug_logging",
                title: "Enable debug logging",
                description: "Show detailed logs for troubleshooting issues.",
                type: "switch",
              }}
              value={experimentalPreferences.enableDebugLogging}
            />
          </SettingItem>

          <SettingItem
            description="GPU acceleration for image rendering (may cause issues)"
            title="Use hardware acceleration for images"
          >
            <SettingRenderer
              onChange={(value) =>
                updateExperimentalPreferences({
                  hardwareAcceleration: value,
                })
              }
              setting={{
                key: "hardware_acceleration",
                title: "Use hardware acceleration for images",
                description:
                  "Use GPU acceleration for image rendering (may cause issues on some systems).",
                type: "switch",
              }}
              value={experimentalPreferences.hardwareAcceleration}
            />
          </SettingItem>
        </CardContent>
      </Card>
    </div>
  );
}
