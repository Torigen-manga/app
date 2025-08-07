import type { PreferDarkMode } from "@common/index";
import { SettingItem } from "@renderer/components/pages/settings/parts/item";
import { SettingRenderer } from "@renderer/components/pages/settings/parts/renderer";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useLayoutSettings } from "@renderer/hooks/services/preferences/helpers";
import { Laptop2, Moon, Sun } from "lucide-react";
import { ThemePreview } from "../parts/theme-preview";

export function Layout() {
	const { layoutPreferences, handlers } = useLayoutSettings();

	if (!layoutPreferences) {
		return null;
	}

	const currentMode =
		layoutPreferences.preferDarkMode === "system"
			? "light"
			: layoutPreferences.preferDarkMode;

	return (
		<>
			<div className="flex w-full flex-col">
				<h2 className="font-medium">Theme Mode</h2>
				<p className="text-muted-foreground text-sm">
					Choose between light, dark, or system theme
				</p>
				<Tabs
					onValueChange={(value) =>
						handlers.handlePreferDarkTheme(value as PreferDarkMode)
					}
					value={layoutPreferences.preferDarkMode}
				>
					<TabsList className="mt-2 w-full">
						<TabsTrigger value="light">
							<Sun className="mr-2 inline" /> Light
						</TabsTrigger>
						<TabsTrigger value="dark">
							<Moon className="mr-2 inline" /> Dark
						</TabsTrigger>
						<TabsTrigger value="system">
							<Laptop2 className="mr-2 inline" /> System
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="mt-2 flex w-full flex-col">
				<h2 className="font-medium">App Theme</h2>
				<p className="text-muted-foreground text-sm">
					Select the visual theme for the app
				</p>
				<div className="mt-2 grid grid-cols-3 gap-3">
					<ThemePreview
						isSelected={layoutPreferences.theme === "default"}
						mode={currentMode}
						onClick={() => handlers.handleChangeTheme("default")}
						theme="default"
					/>
					<ThemePreview
						isSelected={layoutPreferences.theme === "strawberryRush"}
						mode={currentMode}
						onClick={() => handlers.handleChangeTheme("strawberryRush")}
						theme="strawberryRush"
					/>
					<ThemePreview
						isSelected={layoutPreferences.theme === "blueberryBreeze"}
						mode={currentMode}
						onClick={() => handlers.handleChangeTheme("blueberryBreeze")}
						theme="blueberryBreeze"
					/>
				</div>
			</div>

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
							{ value: "default", label: "Default (Squared)" },
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
