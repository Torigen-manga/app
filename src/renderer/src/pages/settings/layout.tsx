import type { PreferDarkMode, Theme } from "@common/src/types";
import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { Card, CardContent } from "@renderer/components/ui/card";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";
import { useTheme } from "@renderer/hooks/preferences/use-theme";
import { Paintbrush } from "lucide-react";

export default function LayoutPreferences() {
	const { layoutPreferences, updateLayoutPreferences } = usePreferences();
	const { setTheme, setPreferDarkMode } = useTheme();

	if (!layoutPreferences) {
		return <div>Loading...</div>;
	}

	const handlePreferDarkTheme = (value: PreferDarkMode) => {
		updateLayoutPreferences({ preferDarkMode: value });
		setPreferDarkMode(value);
	};

	const handleChangeTheme = (value: Theme) => {
		updateLayoutPreferences({ theme: value });
		setTheme(value);
	};

	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<h1 className="inline-flex items-center gap-4 font-bold text-3xl">
					<Paintbrush />
					Layout & Appearance
				</h1>
				<p className="mt-2 text-muted-foreground">
					Customize how your library and manga covers are displayed.
				</p>
			</div>

			<Card className="p-0">
				<CardContent className="px-4">
					<SettingItem title="Grid Size">
						<SettingRenderer
							onChange={(value) => {
								updateLayoutPreferences({
									gridSize: Number(value),
								});
							}}
							setting={{
								key: "grid_size",
								title: "Grid Size",
								description:
									"Choose how many columns to display in library view.",
								type: "select",
								options: [
									{ value: "4", label: "4" },
									{ value: "6", label: "6" },
									{ value: "8", label: "8" },
									{ value: "10", label: "10" },
									{ value: "12", label: "12" },
								],
							}}
							value={layoutPreferences.gridSize}
						/>
					</SettingItem>

					<SettingItem
						description="Choose between light, dark, or system theme"
						title="Theme Mode"
					>
						<SettingRenderer
							onChange={handlePreferDarkTheme}
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
							onChange={handleChangeTheme}
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
							onChange={(value) =>
								updateLayoutPreferences({
									coverStyle: value,
								})
							}
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
							onChange={(value) =>
								updateLayoutPreferences({
									showTitles: value,
								})
							}
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
							onChange={(value) =>
								updateLayoutPreferences({
									compactMode: value,
								})
							}
							setting={{
								key: "compact_mode",
								title: "Compact Mode",
								description:
									"Use smaller margins and fonts for a denser layout.",
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
							onChange={(value) =>
								updateLayoutPreferences({
									showReadIndicator: value,
								})
							}
							setting={{
								key: "show_read_indicators",
								title: "Show read/unread indicators",
								description:
									"Display visual indicators for read and unread manga.",
								type: "switch",
							}}
							value={layoutPreferences.showReadIndicator}
						/>
					</SettingItem>
				</CardContent>
			</Card>
		</div>
	);
}
