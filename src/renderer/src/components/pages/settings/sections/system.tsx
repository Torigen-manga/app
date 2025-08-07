import { SettingItem } from "@renderer/components/pages/settings/parts/item";
import { SettingRenderer } from "@renderer/components/pages/settings/parts/renderer";
import { useSystemBehaviorSettings } from "@renderer/hooks/services/preferences/helpers";

export function System() {
	const { systemBehaviorPreferences, handlers } = useSystemBehaviorSettings();

	if (!systemBehaviorPreferences) {
		return null;
	}

	return (
		<>
			<SettingItem
				description="Automatically check for updates when app starts"
				title="Check for new chapters on startup"
			>
				<SettingRenderer
					onChange={handlers.handleUpdateOnStartupChange}
					setting={{
						key: "check_new_chapters",
						title: "Check for new chapters on startup",
						description: "Automatically check for updates when the app starts.",
						type: "switch",
					}}
					value={systemBehaviorPreferences.updateOnStartup}
				/>
			</SettingItem>

			<SettingItem
				description="Show confirmation dialog when removing manga"
				title="Confirm before removing manga"
			>
				<SettingRenderer
					onChange={handlers.handleConfirmRemovalChange}
					setting={{
						key: "confirm_removal",
						title: "Confirm before removing manga",
						description: "Show confirmation dialog when removing manga.",
						type: "switch",
					}}
					value={systemBehaviorPreferences.confirmRemoval}
				/>
			</SettingItem>

			<SettingItem
				description="Show system notifications for new chapters"
				title="Enable notifications"
			>
				<SettingRenderer
					onChange={handlers.handleNotificationsChange}
					setting={{
						key: "enable_notifications",
						title: "Enable notifications",
						description:
							"Show system notifications when new chapters are added.",
						type: "switch",
					}}
					value={systemBehaviorPreferences.enableNotifications}
				/>
			</SettingItem>
		</>
	);
}
