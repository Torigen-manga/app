import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Registry, RegistryEntry } from "@common/index";
import type {
	SourceCapabilities,
	SourceInfo,
	SourceProvider,
} from "@torigen/mounter";
import { directories, paths } from "../../paths";

interface ExtensionSyncResult {
	loaded: Array<{
		info: SourceInfo;
		capabilities: SourceCapabilities;
	}>;
	failed: Array<{ path: string; error: Error }>;
	removed: string[];
}

class RegistryService {
	private readonly base = directories.extensionsDir;
	private readonly registryFile = paths.registryFilePath;

	async init(): Promise<void> {
		await this.ensureRegistry();
	}

	private async ensureRegistry(): Promise<void> {
		try {
			await access(this.registryFile);
		} catch {
			const initialRegistry: Registry = {};
			await writeFile(
				this.registryFile,
				JSON.stringify(initialRegistry, null, 2)
			);
		}
	}

	private async loadRegistry(): Promise<Registry> {
		try {
			const data = await readFile(this.registryFile, "utf-8");
			return JSON.parse(data);
		} catch {
			return {};
		}
	}

	private async saveRegistry(registry: Registry): Promise<boolean> {
		try {
			await writeFile(this.registryFile, JSON.stringify(registry, null, 2));
			return true;
		} catch {
			return false;
		}
	}

	private async loadExtension(fileName: string) {
		const filePath = path.join(this.base, fileName);
		const fileUrl = pathToFileURL(filePath).href;

		try {
			const mod = await import(fileUrl);

			if (!mod.default) {
				throw new Error(
					`Extension in ${fileName} does not have a default export (expected a Source class).`
				);
			}
			// biome-ignore lint/suspicious/noExplicitAny: Necessary for flexibility
			type SourceClassConstructor = new (requestManager: any) => SourceProvider;
			const SourceClass = mod.default as SourceClassConstructor;

			const requestInstance = {};
			const sourceInstance = new SourceClass(requestInstance);

			return {
				info: sourceInstance.info as SourceInfo,
				capabilities: sourceInstance.capabilities,
			};
		} catch (err) {
			throw new Error(
				`Failed to load extension from ${fileName}: ${(err as Error).message}`
			);
		}
	}

	private async loadExtFiles(): Promise<string[]> {
		try {
			const files = await readdir(this.base, { withFileTypes: true });
			return files
				.filter((item) => item.isFile() && item.name.endsWith(".js"))
				.map((item) => item.name);
		} catch {
			return [];
		}
	}

	private async syncRegistryWithFilesystem(): Promise<ExtensionSyncResult> {
		const currentFiles = await this.loadExtFiles();
		const currentRegistry = await this.loadRegistry();

		const result: ExtensionSyncResult = {
			loaded: [],
			failed: [],
			removed: [],
		};

		const updatedRegistry: Registry = { ...currentRegistry };

		for (const fileName of currentFiles) {
			try {
				// biome-ignore lint/nursery/noAwaitInLoop: Must await each extension load to ensure proper error handling
				const { info, capabilities } = await this.loadExtension(fileName);

				updatedRegistry[info.id] = {
					name: info.name,
					path: fileName,
					dependencies: info.dependencies?.map((dep) => dep.name) || [],
					capabilities,
				};

				result.loaded.push({ info, capabilities });
			} catch (err) {
				result.failed.push({ path: fileName, error: err as Error });
			}
		}

		const currentFileSet = new Set(currentFiles);

		for (const [extensionId, entry] of Object.entries(updatedRegistry)) {
			if (!currentFileSet.has(entry.path)) {
				delete updatedRegistry[extensionId];
				result.removed.push(extensionId);
			}
		}

		await this.saveRegistry(updatedRegistry);

		return result;
	}

	async loadExtensions(): Promise<
		{ info: SourceInfo; capabilities: SourceCapabilities }[]
	> {
		try {
			const syncResult = await this.syncRegistryWithFilesystem();

			return syncResult.loaded;
		} catch {
			throw new Error("Failed to load extensions from registry");
		}
	}

	async getExtensionPath(extensionId: string): Promise<string | null> {
		const registry = await this.loadRegistry();
		const entry = registry[extensionId];
		return entry ? path.join(this.base, entry.path) : null;
	}

	async getExtensionEntry(extensionId: string): Promise<RegistryEntry | null> {
		const registry = await this.loadRegistry();
		return registry[extensionId] || null;
	}

	async hasExtension(extensionId: string): Promise<boolean> {
		const registry = await this.loadRegistry();
		return extensionId in registry;
	}
}

const registryService = new RegistryService();
export { registryService };
