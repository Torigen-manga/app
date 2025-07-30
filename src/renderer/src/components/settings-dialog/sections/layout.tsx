import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { useLayoutSettings } from "@renderer/hooks/services/preferences/helpers";

export function Layout() {
  const { layoutPreferences, handlers } = useLayoutSettings();

  if (!layoutPreferences) {
    return null;
  }

  return (
    <>
      <SettingItem
        description="Choose between light, dark, or system theme"
        title="Theme Mode"
      >
        <SettingRenderer
          onChange={handlers.handlePreferDarkTheme}
          setting={{
            key: "theme_mode",
            title: "Theme Mode",
            description: "Choose between light, dark, or system theme.",
            type: "select",
            options: [
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ],
          }}
          value={layoutPreferences.preferDarkMode}
        />
      </SettingItem>

      <SettingItem
        description="Select the visual theme for the app"
        title="App Theme"
      >
        <SettingRenderer
          onChange={handlers.handleChangeTheme}
          setting={{
            key: "app_theme",
            title: "App Theme",
            description: "Select the visual theme for the app.",
            type: "select",
            options: [
              { value: "default", label: "Default" },
              { value: "strawberryRush", label: "Strawberry Rush" },
              { value: "blueberryBreeze", label: "Blueberry Breeze" },
            ],
          }}
          value={layoutPreferences.theme}
        />
      </SettingItem>

      <SettingItem
        description="Visual style for manga cover images"
        title="Cover Style"
      >
        <SettingRenderer
          onChange={handlers.handleCoverStyleChange}
          setting={{
            key: "cover_style",
            title: "Cover Style",
            description: "Choose the visual style for manga cover images.",
            type: "select",
            options: [
              { value: "default", label: "Default" },
              { value: "rounded", label: "Rounded" },
              { value: "border", label: "Border" },
              { value: "shadow", label: "Shadow" },
            ],
          }}
          value={layoutPreferences.coverStyle}
        />
      </SettingItem>

      <SettingItem
        description="Display manga titles below cover images"
        title="Show titles under covers"
      >
        <SettingRenderer
          onChange={handlers.handleShowTitlesChange}
          setting={{
            key: "show_titles",
            title: "Show titles under covers",
            description: "Display manga titles below cover images.",
            type: "switch",
          }}
          value={layoutPreferences.showTitles}
        />
      </SettingItem>

      <SettingItem
        description="Smaller margins and fonts for denser layout"
        title="Compact Mode"
      >
        <SettingRenderer
          onChange={handlers.handleCompactModeChange}
          setting={{
            key: "compact_mode",
            title: "Compact Mode",
            description: "Use smaller margins and fonts for a denser layout.",
            type: "switch",
          }}
          value={layoutPreferences.compactMode}
        />
      </SettingItem>

      <SettingItem
        description="Display visual indicators for read and unread manga"
        title="Show read/unread indicators"
      >
        <SettingRenderer
          onChange={handlers.handleReadIndicatorChange}
          setting={{
            key: "show_read_indicators",
            title: "Show read/unread indicators",
            description: "Display visual indicators for read and unread manga.",
            type: "switch",
          }}
          value={layoutPreferences.showReadIndicator}
        />
      </SettingItem>
    </>
  );
}
