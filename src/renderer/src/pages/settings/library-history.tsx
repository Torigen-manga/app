import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { Card, CardContent } from "@renderer/components/ui/card";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";
import { Library } from "lucide-react";

export default function LibraryHistory() {
	const { libraryHistoryPreferences, updateLibraryHistoryPreferences } =
		usePreferences();

	if (!libraryHistoryPreferences) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<h1 className="flex items-center gap-3 font-bold text-3xl">
					<Library />
					Library & History
				</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your reading history and library organization.
				</p>
			</div>

			<Card className="p-0">
				<CardContent className="px-4">
					<SettingItem
						description="Track and save your reading progress"
						title="Enable read history"
					>
						<SettingRenderer
							onChange={(value) =>
								updateLibraryHistoryPreferences({
									enabled: value,
								})
							}
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
							onChange={(value) =>
								updateLibraryHistoryPreferences({
									maxEntries: Number(value),
								})
							}
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
							onChange={(value) =>
								updateLibraryHistoryPreferences({
									showRecent: value,
								})
							}
							setting={{
								key: "show_recently_read",
								title: "Show recently read section on home",
								description: "Display recently read manga on the home page.",
								type: "switch",
							}}
							value={libraryHistoryPreferences.showRecent}
						/>
					</SettingItem>
				</CardContent>
			</Card>
		</div>
	);
}
