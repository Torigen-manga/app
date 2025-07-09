import { z } from "zod";

const themeEnum = z
	.enum(["default", "strawberryRush", "blueberryBreeze"])
	.default("default");
const preferDarkModeEnum = z
	.enum(["light", "dark", "system"])
	.default("system");
const coverStyleEnum = z
	.enum(["default", "rounded", "border", "shadow"])
	.default("default");

const layoutPreferencesSchema = z.object({
	gridSize: z.number().min(4).max(12).default(6),
	theme: themeEnum,
	preferDarkMode: preferDarkModeEnum,
	showTitles: z.boolean().default(true),
	compactMode: z.boolean().default(false),
	showReadIndicator: z.boolean().default(true),
	coverStyle: coverStyleEnum,
});

const pageLayoutEnum = z
	.enum(["single-page", "double-page", "vertical-scroll"])
	.default("single-page");
const zoomBehaviorEnum = z
	.enum(["fit-width", "fit-height", "actual-size", "manual"])
	.default("fit-width");

const readerPreferencesSchema = z.object({
	pageLayout: pageLayoutEnum,
	zoomBehavior: zoomBehaviorEnum,
	readingDirection: z.enum(["ltr", "rtl"]).default("ltr"),
	zoomLevel: z.number().min(0).max(5).optional(),
	rememberZoom: z.boolean().default(true),
});

const libraryHistoryPreferencesSchema = z.object({
	enabled: z.boolean().default(true),
	maxEntries: z.number().min(10).max(500).default(100),
	showRecent: z.boolean().default(true),
});

const systemBehaviorPreferencesSchema = z.object({
	updateOnStartup: z.boolean().default(true),
	confirmRemoval: z.boolean().default(true),
	enableNotifications: z.boolean().default(true),
});

const experimentalPreferencesSchema = z.object({
	enableCustomSources: z.boolean().default(true),
	enableDebugLogging: z.boolean().default(false),
	hardwareAcceleration: z.boolean().default(true),
});

const appPreferencesSchema = z.object({
	layoutPreferences: layoutPreferencesSchema,
	readerDisplayPreferences: readerPreferencesSchema,
	libraryHistoryPreferences: libraryHistoryPreferencesSchema,
	systemBehaviorPreferences: systemBehaviorPreferencesSchema,
	experimentalPreferences: experimentalPreferencesSchema,
});

type AppPreferences = z.infer<typeof appPreferencesSchema>;
type LayoutPreferences = z.infer<typeof layoutPreferencesSchema>;
type ReaderPreferences = z.infer<typeof readerPreferencesSchema>;
type LibraryHistoryPreferences = z.infer<
	typeof libraryHistoryPreferencesSchema
>;
type SystemBehaviorPreferences = z.infer<
	typeof systemBehaviorPreferencesSchema
>;
type ExperimentalPreferences = z.infer<typeof experimentalPreferencesSchema>;

type Theme = z.infer<typeof themeEnum>;
type PreferDarkMode = z.infer<typeof preferDarkModeEnum>;
type CoverStyle = z.infer<typeof coverStyleEnum>;

type PageLayout = z.infer<typeof pageLayoutEnum>;
type ZoomBehavior = z.infer<typeof zoomBehaviorEnum>;

export {
	appPreferencesSchema,
	layoutPreferencesSchema,
	readerPreferencesSchema,
	libraryHistoryPreferencesSchema,
	systemBehaviorPreferencesSchema,
	experimentalPreferencesSchema,
};

export type {
	// Schema types
	AppPreferences,
	LayoutPreferences,
	ReaderPreferences,
	LibraryHistoryPreferences,
	SystemBehaviorPreferences,
	ExperimentalPreferences,
	// Enums
	Theme,
	PreferDarkMode,
	CoverStyle,
	PageLayout,
	ZoomBehavior,
};
