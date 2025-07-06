import { AppManga } from '@common/index'
import { mangaTable } from '@common/index'
import { db } from '../../db'
import { eq, and } from 'drizzle-orm'

class AppMangaService {
  async addManga(data: AppManga): Promise<void> {
    const existingManga = await this.getMangaById(data.sourceId, data.mangaId)

    if (existingManga) {
      throw new Error(`Manga with ID ${data.mangaId} already exists in source ${data.sourceId}`)
    }

    await db
      .insert(mangaTable)
      .values(data)
      .returning()
      .then((r) => r[0])

    return
  }

  async getMangaById(sourceId: string, mangaId: string): Promise<AppManga | null> {
    const existingManga = await db
      .select()
      .from(mangaTable)
      .where(and(eq(mangaTable.sourceId, sourceId), eq(mangaTable.mangaId, mangaId)))
      .limit(1)
      .then((r) => r[0])

    return existingManga
  }
}

const appMangaService = new AppMangaService()

export { appMangaService, AppMangaService }
