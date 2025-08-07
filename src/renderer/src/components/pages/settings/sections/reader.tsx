import type { PageLayout, ReadingDir } from "@common/index";
import { SettingItem } from "@renderer/components/pages/settings/parts/item";
import { SettingRenderer } from "@renderer/components/pages/settings/parts/renderer";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renderer/components/ui/select";
import { Stepper } from "@renderer/components/ui/stepper";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { useReaderSettings } from "@renderer/hooks/services/preferences/helpers";
import { AlignVerticalSpaceAround, BookOpen, File } from "lucide-react";

export function Reader() {
	const { readerDisplayPreferences, handlers } = useReaderSettings();

	if (!readerDisplayPreferences) {
		return null;
	}

	const zoomBehaviorOptions = [
		{ value: "fit-width", label: "Fit width" },
		{ value: "fit-height", label: "Fit height" },
		{ value: "actual-size", label: "Actual size" },
		{ value: "manual", label: "Manual" },
	];

	return (
		<>
			<div className="flex w-full flex-col gap-2">
				<h2 className="font-medium">Page Layout</h2>
				<Tabs
					onValueChange={(value) =>
						handlers.handlePageLayoutChange(value as PageLayout)
					}
					value={readerDisplayPreferences.pageLayout}
				>
					<TabsList className="w-full">
						<TabsTrigger value="single-page">
							<File className="mr-2 inline" /> Single Page
						</TabsTrigger>
						<TabsTrigger value="double-page">
							<BookOpen className="mr-2 inline" /> Double Page
						</TabsTrigger>
						<TabsTrigger value="vertical-scroll">
							<AlignVerticalSpaceAround className="mr-2 inline" />
							Vertical Scroll
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{readerDisplayPreferences.pageLayout !== "vertical-scroll" && (
				<div className="mt-2 flex w-full flex-col">
					<h2 className="font-medium">Reading Direction</h2>
					<p className="text-muted-foreground text-sm">
						Choose the direction for reading text.
					</p>
					<Tabs
						onValueChange={(value) =>
							handlers.handleReadingDirectionChange(value as ReadingDir)
						}
						value={readerDisplayPreferences.readingDirection}
					>
						<TabsList className="mt-2 w-full">
							<TabsTrigger value="ltr">Left to right</TabsTrigger>
							<TabsTrigger value="rtl">Right to left</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			)}

			<SettingItem
				description="How images are scaled to fit the screen"
				title="Zoom Behavior"
			>
				<Select
					onValueChange={handlers.handleZoomBehaviorChange}
					value={readerDisplayPreferences.zoomBehavior}
				>
					<SelectTrigger className="w-48">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{zoomBehaviorOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
