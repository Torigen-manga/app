import { access, readFile, writeFile } from "node:fs/promises";
import { type AppPreferences, appPreferencesSchema } from "@common/index";
import { paths } from "../../paths";
import { defaultPreferences } from "./default";

class PreferencesService {
	private readonly preferencesFile = paths.preferencesFilePath;

	async init(): Promise<void> {
		await this.ensurePreferences();
	}

	private async ensurePreferences(): Promise<void> {
		try {
			await access(this.preferencesFile);
		} catch {
			const parsed = appPreferencesSchema.parse(defaultPreferences);
			await writeFile(
				this.preferencesFile,
				JSON.stringify(parsed, null, 2),
				"utf-8"
			);
		}
	}

	async loadPreferences(): Promise<AppPreferences> {
		try {
			const data = await readFile(this.preferencesFile, "utf-8");
			return appPreferencesSchema.parse(JSON.parse(data));
		} catch {
			const parsed = appPreferencesSchema.parse(defaultPreferences);
			return parsed;
		}
	}

	async savePreferences(preferences: AppPreferences): Promise<void> {
		try {
			const parsed = appPreferencesSchema.parse(preferences);

			await writeFile(
				this.preferencesFile,
				JSON.stringify(parsed, null, 2),
				"utf-8"
			);
		} catch {
			throw new Error("Failed to save preferences");
		}
	}

	async resetPreferences(): Promise<void> {
		const parsed = appPreferencesSchema.parse(defaultPreferences);
		await this.savePreferences(parsed);
	}
}

const preferencesService = new PreferencesService();

export { preferencesService };
