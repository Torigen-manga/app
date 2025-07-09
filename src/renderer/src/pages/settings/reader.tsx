import { SettingItem } from "@renderer/components/settings/item";
import { SettingRenderer } from "@renderer/components/settings/renderer";
import { Stepper } from "@renderer/components/stepper";
import { Card, CardContent } from "@renderer/components/ui/card";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";
import { BookOpen } from "lucide-react";

export default function ReaderPreferences() {
	const { readerDisplayPreferences, updateReaderPreferences } =
		usePreferences();

	if (!readerDisplayPreferences) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-2xl">
			<div className="mb-6">
				<h1 className="flex items-center gap-3 font-bold text-3xl">
					<BookOpen />
					Reader Preferences
				</h1>
				<p className="mt-2 text-muted-foreground">
					Configure how manga pages are displayed and navigated.
				</p>
			</div>

			<Card className="p-0">
				<CardContent className="px-4">
					<SettingItem
						description="How pages are arranged in the reader"
						title="Page Layout"
					>
						<SettingRenderer
							onChange={(value) =>
								updateReaderPreferences({
									pageLayout: value,
								})
							}
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
							onChange={(value) =>
								updateReaderPreferences({
									zoomBehavior: value,
								})
							}
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
								onChange={(value) => {
									updateReaderPreferences({
										zoomLevel: value,
									});
								}}
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
							onChange={(value) =>
								updateReaderPreferences({
									readingDirection: value,
								})
							}
							setting={{
								key: "reading_direction",
								title: "Default Reading Direction",
								description:
									"Choose the default direction for page navigation.",
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
							onChange={(value) =>
								updateReaderPreferences({
									rememberZoom: value,
								})
							}
							setting={{
								key: "remember_zoom",
								title: "Remember last zoom level",
								description: "Save zoom level between reading sessions.",
								type: "switch",
							}}
							value={readerDisplayPreferences.rememberZoom}
						/>
					</SettingItem>
				</CardContent>
			</Card>
		</div>
	);
}
