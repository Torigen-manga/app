import { pathToFileURL } from "node:url";
import type {
	Chapter,
	ChapterEntry,
	Manga,
	MangaEntry,
	MetadataProvider,
	PagedResults,
	RequestManager,
	SearchRequest,
	Section,
	SourceCapabilities,
	SourceInfo,
	SourceProvider,
	Tag,
} from "@torigen/mounter";
import { registryService } from "./registry";
import { ProxyFetch } from "./request-manager";

class ExtensionService {
	private readonly cache = new Map<string, SourceProvider>();

	async init() {
		await registryService.loadExtensions();
	}

	private async getExtension(id: string) {
		const file = await registryService.getExtensionPath(id);

		if (!id) {
			throw new Error(`Extension with ID ${id} not found`);
		}

		if (!file) {
			throw new Error(`Extension with ID ${id} not found in registry`);
		}

		const cached = this.cache.get(id);
		if (cached !== undefined) {
			return cached;
		}

		const fileUrl = pathToFileURL(file).href;

		const mod = await import(fileUrl);

		if (!mod.default) {
			throw new Error(
				`Extension in ${file} does not have a default export (expected a Source class).`
			);
		}

		type SourceClassConstructor = new (
			requestManager: RequestManager
		) => SourceProvider;

		const SourceClass = mod.default as SourceClassConstructor;
		const requestInstance = new ProxyFetch();
		const sourceInstance = new SourceClass(requestInstance);

		this.cache.set(id, sourceInstance);

		return sourceInstance;
	}

	async getExtensionInfo(id: string): Promise<SourceInfo> {
		const ext = await this.getExtension(id);

		if (!ext.info) {
			throw new Error(`Extension ${id} does not have info defined`);
		}

		return ext.info;
	}

	async getMetadata(id: string): Promise<MetadataProvider> {
		const ext = await this.getExtension(id);

		if (!ext.metadata) {
			throw new Error(`Extension ${id} does not implement getMetadata method`);
		}

		return ext.metadata;
	}

	async getCapabilities(id: string): Promise<SourceCapabilities> {
		const ext = await this.getExtension(id);

		if (!ext.capabilities) {
			throw new Error(
				`Extension ${id} does not implement getCapabilities method`
			);
		}

		return ext.capabilities;
	}

	async getMultiCapabilities(sources: string[]): Promise<SourceCapabilities[]> {
		const capabilities: SourceCapabilities[] = [];

		await Promise.all(
			sources.map(async (id) => {
				try {
					const caps = await this.getCapabilities(id);
					capabilities.push(caps);
				} catch (err) {
					// biome-ignore lint/suspicious/noConsole: debugging
					console.warn(`Failed to get capabilities for source ${id}`, err);
				}
			})
		);

		return capabilities;
	}

	async getHomepage(id: string): Promise<Section[]> {
		const ext = await this.getExtension(id);

		if (!ext.getHomepage) {
			throw new Error(`Extension ${id} does not implement getHomepage method`);
		}

		return ext.getHomepage();
	}

	async getMangaDetails(id: string, mangaId: string): Promise<Manga> {
		const ext = await this.getExtension(id);

		if (!ext.getMangaDetails) {
			throw new Error(
				`Extension ${id} does not implement getMangaDetails method`
			);
		}

		return ext.getMangaDetails(mangaId);
	}

	async getMangaChapters(id: string, mangaId: string): Promise<ChapterEntry[]> {
		const ext = await this.getExtension(id);

		if (!ext.getChapters) {
			throw new Error(
				`Extension ${id} does not implement getMangaChapters method`
			);
		}

		return ext.getChapters(mangaId);
	}

	async getViewMore(
		id: string,
		sectionId: string,
		page: number
	): Promise<PagedResults<MangaEntry>> {
		const ext = await this.getExtension(id);

		if (!ext.getViewMoreItems) {
			throw new Error(
				`Extension ${id} does not implement getViewMoreItems method`
			);
		}

		return ext.getViewMoreItems(sectionId, page);
	}

	async getMangaSearch(
		id: string,
		query: SearchRequest
	): Promise<PagedResults<MangaEntry>> {
		const ext = await this.getExtension(id);

		if (!ext.getSearchResults) {
			throw new Error(
				`Extension ${id} does not implement getSearchResults method`
			);
		}

		return ext.getSearchResults(query);
	}

	async getMultiSearch(sources: string[], title: string, limit = 6) {
		const results: Record<string, MangaEntry[]> = {};

		await Promise.all(
			sources.map(async (id) =>
				this.getMangaSearch(id, {
					title,
					includedTags: [],
					excludedTags: [],
					parameters: {},
				})
					.then((res) => {
						results[id] = res.results.slice(0, limit);
					})
					.catch((err) => {
						// biome-ignore lint/suspicious/noConsole: debugging
						console.warn(`Search failed for source ${id}`, err);
						results[id] = [];
					})
			)
		);

		return results;
	}

	async getChapterDetails(
		id: string,
		mangaId: string,
		chapterId: string
	): Promise<Chapter> {
		const ext = await this.getExtension(id);

		if (!ext.getChapterDetails) {
			throw new Error(
				`Extension ${id} does not implement getChapterDetails method`
			);
		}

		return ext.getChapterDetails(mangaId, chapterId);
	}

	async getTags(id: string): Promise<Tag[]> {
		const ext = await this.getExtension(id);

		if (!ext.getSearchTags) {
			throw new Error(
				`Extension ${id} does not implement getSearchTags method`
			);
		}

		return ext.getSearchTags();
	}
}

const extensionService = new ExtensionService();

export { extensionService };
