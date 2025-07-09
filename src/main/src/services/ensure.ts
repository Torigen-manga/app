import { extensionService, registryService } from "./extension";

async function ensureExtensionService(): Promise<void> {
	await Promise.allSettled([extensionService.init(), registryService.init()]);
}

// TODO: Implement database initialization logic
// biome-ignore lint/suspicious/noEmptyBlockStatements: This is a placeholder for future database initialization logic
async function ensureDatabase(): Promise<void> {}

export { ensureDatabase, ensureExtensionService };
