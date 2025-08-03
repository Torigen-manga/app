import { existsSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "electron";
import { paths } from "../paths";
import { extensionService, registryService } from "./extension";

async function ensureExtensionService(): Promise<void> {
	await Promise.allSettled([extensionService.init(), registryService.init()]);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

const defaultDbPath = isDev
	? path.resolve(__dirname, "../../resources/default.db")
	: path.resolve(process.resourcesPath, "resources/default.db");

async function ensureDatabase(): Promise<void> {
	const dbPath = paths.databasePath;

	if (!existsSync(dbPath)) {
		await copyFile(defaultDbPath, dbPath);
	}
}

export { ensureDatabase, ensureExtensionService };
