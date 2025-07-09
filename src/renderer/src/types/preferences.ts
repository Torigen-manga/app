import type { LucideIcon } from "lucide-react";

type PreferenceType =
	| "select"
	| "switch"
	| "slider"
	| "input"
	| "color"
	| "folder"
	| "stepper";

interface PreferenceOption {
	value: string;
	label: string;
}

interface Preferences {
	key: string;
	title: string;
	description?: string;
	type: PreferenceType;
	options?: PreferenceOption[];
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	// biome-ignore lint/suspicious/noExplicitAny: This is a generic type for default values
	defaultValue?: any;
	storeKey?: string;
}

interface PreferencesSection {
	key: string;
	title: string;
	icon: LucideIcon;
	settings: Preferences[];
}

export type {
	PreferenceType,
	PreferenceOption,
	Preferences,
	PreferencesSection,
};
