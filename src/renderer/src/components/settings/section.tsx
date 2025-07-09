import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@renderer/components/ui/card";
import type { PreferencesSection } from "@renderer/types/preferences";
import { useState } from "react";
import { SettingItem } from "./item";
import { SettingRenderer } from "./renderer";

interface SettingsSectionProps {
	key: string;
	section: PreferencesSection;
}

export function SettingsSection({ section }: SettingsSectionProps) {
	//  biome-ignore lint/suspicious/noExplicitAny: This is a generic settings section
	const [values, setValues] = useState<Record<string, any>>(() =>
		Object.fromEntries(section.settings.map((s) => [s.key, s.defaultValue]))
	);

	//  biome-ignore lint/suspicious/noExplicitAny: This is a generic settings section
	function handleChange(key: string, value: any) {
		setValues((prev) => ({ ...prev, [key]: value }));
	}

	const Icon = section.icon;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="inline-flex items-center gap-2 text-2xl">
					<Icon size={20} /> {section.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{section.settings.map((setting) => (
					<SettingItem
						description={setting.description}
						key={setting.key}
						title={setting.title}
					>
						<SettingRenderer
							onChange={(val) => handleChange(setting.key, val)}
							setting={setting}
							value={values[setting.key]}
						/>
					</SettingItem>
				))}
			</CardContent>
		</Card>
	);
}
