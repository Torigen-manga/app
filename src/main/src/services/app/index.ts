import { AppManga } from '@common/index'
import type { AppMangaServiceInterface } from '../interfaces'
import { paths } from '../paths'
import { writeFile, access, readFile } from 'fs/promises'

class AppMangaService implements AppMangaServiceInterface {
  private readonly mangaFile = paths.dataFilePath

  async init(): Promise<void> {
    await this.ensureMangaFile()
  }

  private async ensureMangaFile(): Promise<void> {
    try {
      await access(this.mangaFile)
    } catch (error) {
      await writeFile(this.mangaFile, JSON.stringify([]), 'utf-8')
    }
  }

  private async readMangaData(): Promise<AppManga[]> {
    const raw = await readFile(this.mangaFile, 'utf-8')
    return JSON.parse(raw) as AppManga[]
  }

  async addManga(data: AppManga): Promise<AppManga> {
    const mangaData = await this.readMangaData()

    const existingIndex = mangaData.findIndex(
      (m) => m.mangaId === data.mangaId && m.sourceId === data.sourceId
    )

    if (existingIndex !== -1) {
      mangaData[existingIndex] = data
    } else {
      mangaData.push(data)
    }

    await writeFile(this.mangaFile, JSON.stringify(mangaData, null, 2), 'utf-8')
    return data
  }

  async getMangaById(sourceId: string, mangaId: string): Promise<AppManga | null> {
    const mangaData = await this.readMangaData()
    return mangaData.find((m) => m.mangaId === mangaId && m.sourceId === sourceId) ?? null
  }
}

const appMangaService = new AppMangaService()

export { appMangaService, AppMangaService }
