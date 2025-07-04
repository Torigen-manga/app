import type {
  Chapter,
  ChapterEntry,
  Manga,
  PagedResults,
  RequestManager,
  SearchRequest,
  Section,
  SourceCapabilities,
  SourceFieldsMetadata,
  SourceInfo,
  SourceProvider,
  Tag
} from '@torigen/mounter'
import { registryService } from './registry'
import { ProxyFetch } from './request-manager'
import { pathToFileURL } from 'url'

class ExtensionService {
  private readonly cache = new Map<string, SourceProvider>()

  async init() {
    await registryService.loadExtensions()
  }

  private async getExtension(id: string) {
    const file = await registryService.getExtensionPath(id)

    if (!id) {
      throw new Error(`Extension with ID ${id} not found`)
    }

    if (!file) {
      throw new Error(`Extension with ID ${id} not found in registry`)
    }

    if (this.cache.has(id)) {
      return this.cache.get(id)!
    }

    const fileUrl = pathToFileURL(file).href

    try {
      const mod = await import(fileUrl)

      if (!mod.default) {
        throw new Error(
          `Extension in ${file} does not have a default export (expected a Source class).`
        )
      }

      type SourceClassConstructor = new (requestManager: RequestManager) => SourceProvider

      const SourceClass = mod.default as SourceClassConstructor
      const requestManager = new ProxyFetch()
      const sourceInstance = new SourceClass(requestManager)

      this.cache.set(id, sourceInstance)

      return sourceInstance
    } catch (err) {
      console.error(`Failed to load extension from ${file}:`, err)
      throw err
    }
  }

  async getExtensionInfo(id: string): Promise<SourceInfo> {
    const ext = await this.getExtension(id)

    if (!ext.info) {
      throw new Error(`Extension ${id} does not have info defined`)
    }

    return ext.info
  }

  async getMetadata(id: string): Promise<SourceFieldsMetadata> {
    const ext = await this.getExtension(id)

    if (!ext.fieldsMetadata) {
      throw new Error(`Extension ${id} does not implement getMetadata method`)
    }

    return ext.fieldsMetadata
  }

  async getCapabilities(id: string): Promise<SourceCapabilities> {
    const ext = await this.getExtension(id)

    if (!ext.capabilities) {
      throw new Error(`Extension ${id} does not implement getCapabilities method`)
    }

    return ext.capabilities
  }

  async getHomepage(id: string): Promise<Section[]> {
    const ext = await this.getExtension(id)

    if (!ext.getHomepage) {
      throw new Error(`Extension ${id} does not implement getHomepage method`)
    }

    return ext.getHomepage()
  }

  async getMangaDetails(id: string, mangaId: string): Promise<Manga> {
    const ext = await this.getExtension(id)

    if (!ext.getMangaDetails) {
      throw new Error(`Extension ${id} does not implement getMangaDetails method`)
    }

    return ext.getMangaDetails(mangaId)
  }

  async getMangaChapters(id: string, mangaId: string): Promise<ChapterEntry[]> {
    const ext = await this.getExtension(id)

    if (!ext.getChapters) {
      throw new Error(`Extension ${id} does not implement getMangaChapters method`)
    }

    return ext.getChapters(mangaId)
  }

  async getMangaSearch(id: string, query: SearchRequest): Promise<PagedResults> {
    const ext = await this.getExtension(id)

    if (!ext.getSearchResults) {
      throw new Error(`Extension ${id} does not implement getSearchResults method`)
    }

    return ext.getSearchResults(query)
  }

  async getChapterDetails(id: string, mangaId: string, chapterId: string): Promise<Chapter> {
    const ext = await this.getExtension(id)

    if (!ext.getChapterDetails) {
      throw new Error(`Extension ${id} does not implement getChapterDetails method`)
    }

    return ext.getChapterDetails(mangaId, chapterId)
  }

  async getTags(id: string): Promise<Tag[]> {
    const ext = await this.getExtension(id)

    if (!ext.getSearchTags) {
      throw new Error(`Extension ${id} does not implement getSearchTags method`)
    }

    return ext.getSearchTags()
  }
}

const extensionService = new ExtensionService()

export { extensionService }
