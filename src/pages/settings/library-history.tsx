import { Card, CardContent } from "@/components/ui/card";
import { SettingItem } from "@/components/settings/settings-item";
import { SettingRenderer } from "@/components/settings/settings-renderer";
import { usePreferences } from "@/hooks/use-preferences";
import { Library } from "lucide-react";

export default function LibraryHistory() {
  const { preferences, updateLibraryHistoryPreferences } = usePreferences();

  if (!preferences) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Library />
          Library & History
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your reading history and library organization.
        </p>
      </div>

      <Card className="p-0">
        <CardContent className="px-4">
          <SettingItem
            title="Enable read history"
            description="Track and save your reading progress"
          >
            <SettingRenderer
              setting={{
                key: "enable_history",
                title: "Enable read history",
                description: "Track and save your reading progress.",
                type: "switch",
              }}
              value={preferences.library_history_preferences.enabled}
              onChange={(value) =>
                updateLibraryHistoryPreferences({
                  enabled: value,
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Max read history entries"
            description="Maximum number of entries to keep in history"
          >
            <SettingRenderer
              setting={{
                key: "max_history_entries",
                title: "Max read history entries",
                description: "Maximum number of entries to keep in history.",
                type: "select",
                options: [
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                  { value: "200", label: "200" },
                  { value: "unlimited", label: "Unlimited" },
                ],
              }}
              value={preferences.library_history_preferences.max_entries}
              onChange={(value) =>
                updateLibraryHistoryPreferences({
                  max_entries: Number(value),
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Show recently read section on home"
            description="Display recently read manga on the home page"
          >
            <SettingRenderer
              setting={{
                key: "show_recently_read",
                title: "Show recently read section on home",
                description: "Display recently read manga on the home page.",
                type: "switch",
              }}
              value={preferences.library_history_preferences.show_recent}
              onChange={(value) =>
                updateLibraryHistoryPreferences({
                  show_recent: value,
                })
              }
            />
          </SettingItem>

          <SettingItem
            title="Default library view"
            description="How manga are displayed in the library"
          >
            <SettingRenderer
              setting={{
                key: "default_library_view",
                title: "Default library view",
                description: "Choose how manga are displayed in the library.",
                type: "select",
                options: [
                  { value: "grid", label: "Grid" },
                  { value: "list", label: "List" },
                  { value: "compact", label: "Compact" },
                ],
              }}
              value={
                preferences.library_history_preferences.default_library_view
              }
              onChange={(value) =>
                updateLibraryHistoryPreferences({
                  default_library_view: value,
                })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>
    </div>
  );
}
