import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { Card, CardContent } from "@renderer/components/ui/card";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";
import { Settings as SettingsIcon } from "lucide-react";

export default function SystemBehaviorPreferences() {
	const { systemBehaviorPreferences, updateSystemBehaviorPreferences } =
		usePreferences();

	if (!systemBehaviorPreferences) return <div>Loading...</div>;

	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<h1 className="flex items-center gap-3 font-bold text-3xl">
					<SettingsIcon />
					System & Behavior
				</h1>
				<p className="mt-2 text-muted-foreground">
					Configure app behavior and system integration.
				</p>
			</div>

			<Card className="p-0">
				<CardContent className="px-4">
					<SettingItem
						description="Automatically check for updates when app starts"
						title="Check for new chapters on startup"
					>
						<SettingRenderer
							onChange={(value) =>
								updateSystemBehaviorPreferences({
									updateOnStartup: value,
								})
							}
							setting={{
								key: "check_new_chapters",
								title: "Check for new chapters on startup",
								description:
									"Automatically check for updates when the app starts.",
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
							onChange={(value) =>
								updateSystemBehaviorPreferences({
									confirmRemoval: value,
								})
							}
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
							onChange={(value) =>
								updateSystemBehaviorPreferences({
									enableNotifications: value,
								})
							}
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
				</CardContent>
			</Card>
		</div>
	);
}
