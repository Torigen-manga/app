import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { useExperimentalSettings } from "@renderer/hooks/services/preferences/helpers";

export function Experimental() {
  const { experimentalPreferences, handlers } = useExperimentalSettings();

  if (!experimentalPreferences) {
    return null;
  }

  return (
    <>
      <SettingItem
        description="Allow loading manga from custom source plugins"
        title="Enable custom sources"
      >
        <SettingRenderer
          onChange={handlers.handleCustomSourcesChange}
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
          onChange={handlers.handleDebugLoggingChange}
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
          onChange={handlers.handleHardwareAccelerationChange}
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
    </>
  );
}
