import { SettingItem } from "@renderer/components/pages/settings/parts/item";
import { SettingRenderer } from "@renderer/components/pages/settings/parts/renderer";
import { useLibraryHistorySettings } from "@renderer/hooks/services/preferences/helpers";

export function Library() {
	const { libraryHistoryPreferences, handlers } = useLibraryHistorySettings();

	if (!libraryHistoryPreferences) {
		return null;
	}

	return (
		<>
			<SettingItem
				description="Track and save your reading progress"
				title="Enable read history"
			>
				<SettingRenderer
					onChange={handlers.handleEnabledChange}
					setting={{
						key: "enable_history",
						title: "Enable read history",
						description: "Track and save your reading progress.",
						type: "switch",
					}}
					value={libraryHistoryPreferences.enabled}
				/>
			</SettingItem>

			<SettingItem
				description="Maximum number of entries to keep in history"
				title="Max read history entries"
			>
				<SettingRenderer
					onChange={handlers.handleMaxEntriesChange}
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
					value={libraryHistoryPreferences.maxEntries}
				/>
			</SettingItem>

			<SettingItem
				description="Display recently read manga on the home page"
				title="Show recently read section on home"
			>
				<SettingRenderer
					onChange={handlers.handleShowRecentChange}
					setting={{
						key: "show_recently_read",
						title: "Show recently read section on home",
						description: "Display recently read manga on the home page.",
						type: "switch",
					}}
					value={libraryHistoryPreferences.showRecent}
				/>
			</SettingItem>
		</>
	);
}
