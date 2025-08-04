import { SettingItem } from "@renderer/components/pages/settings/parts/item";
import { SettingRenderer } from "@renderer/components/pages/settings/parts/renderer";
import { Stepper } from "@renderer/components/ui/stepper";
import { useReaderSettings } from "@renderer/hooks/services/preferences/helpers";

export function Reader() {
  const { readerDisplayPreferences, handlers } = useReaderSettings();

  if (!readerDisplayPreferences) {
    return null;
  }

  return (
    <>
      <SettingItem
        description="How pages are arranged in the reader"
        title="Page Layout"
      >
        <SettingRenderer
          onChange={handlers.handlePageLayoutChange}
          setting={{
            key: "page_layout",
            title: "Page Layout",
            description: "Choose how pages are arranged in the reader.",
            type: "select",
            options: [
              { value: "single-page", label: "Single page" },
              { value: "double-page", label: "Double page" },
              { value: "vertical-scroll", label: "Vertical scroll" },
            ],
          }}
          value={readerDisplayPreferences.pageLayout}
        />
      </SettingItem>

      <SettingItem
        description="How images are scaled to fit the screen"
        title="Zoom Behavior"
      >
        <SettingRenderer
          onChange={handlers.handleZoomBehaviorChange}
          setting={{
            key: "zoom_behavior",
            title: "Zoom Behavior",
            description: "Choose how images are scaled to fit the screen.",
            type: "select",
            options: [
              { value: "fit-width", label: "Fit width" },
              { value: "fit-height", label: "Fit height" },
              { value: "actual-size", label: "Actual size" },
              { value: "manual", label: "Manual" },
            ],
          }}
          value={readerDisplayPreferences.zoomBehavior}
        />
      </SettingItem>

      {readerDisplayPreferences.zoomBehavior === "manual" && (
        <SettingItem description="Adjust zoom level" title="Zoom Level">
          <Stepper
            max={200}
            onChange={handlers.handleZoomLevelChange}
            step={25}
            value={readerDisplayPreferences.zoomLevel || 100}
          />
        </SettingItem>
      )}

      <SettingItem
        description="Direction for page navigation"
        title="Default Reading Direction"
      >
        <SettingRenderer
          onChange={handlers.handleReadingDirectionChange}
          setting={{
            key: "reading_direction",
            title: "Default Reading Direction",
            description: "Choose the default direction for page navigation.",
            type: "select",
            options: [
              { value: "ltr", label: "Left-to-right" },
              { value: "rtl", label: "Right-to-left" },
            ],
          }}
          value={readerDisplayPreferences.readingDirection}
        />
      </SettingItem>

      <SettingItem
        description="Save zoom level between reading sessions"
        title="Remember last zoom level"
      >
        <SettingRenderer
          onChange={handlers.handleRememberZoomChange}
          setting={{
            key: "remember_zoom",
            title: "Remember last zoom level",
            description: "Save zoom level between reading sessions.",
            type: "switch",
          }}
          value={readerDisplayPreferences.rememberZoom}
        />
      </SettingItem>
    </>
  );
}
