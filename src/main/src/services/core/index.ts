import type { AppManga } from "@common/index";
import { mangaTable } from "@common/index";
import { and, eq, or } from "drizzle-orm";
import { db } from "../../db";

class AppMangaService {
	async addManga(data: AppManga): Promise<void> {
		const existingManga = await this.getMangaById(data.sourceId, data.mangaId);

		if (existingManga) {
			throw new Error(
				`Manga with ID ${data.mangaId} already exists in source ${data.sourceId}`
			);
		}

		await db
			.insert(mangaTable)
			.values(data)
			.returning()
			.then((r) => r[0]);

		return;
	}

	async getMangaById(
		sourceId: string,
		mangaId: string
	): Promise<AppManga | null> {
		const existingManga = await db
			.select()
			.from(mangaTable)
			.where(
				and(eq(mangaTable.sourceId, sourceId), eq(mangaTable.mangaId, mangaId))
			)
			.limit(1)
			.then((r) => r[0]);

		return existingManga;
	}

	async getManyByKeys(keys: { sourceId: string; mangaId: string }[]) {
		if (keys.length === 0) {
			return [];
		}

		const metadataList = await db
			.select()
			.from(mangaTable)
			.where(
				or(
					...keys.map((k) =>
						and(
							eq(mangaTable.sourceId, k.sourceId),
							eq(mangaTable.mangaId, k.mangaId)
						)
					)
				)
			);

		return metadataList;
	}

	async updateManga(
		sourceId: string,
		mangaId: string,
		data: Partial<AppManga>
	): Promise<void> {
		const res = await db
			.update(mangaTable)
			.set(data)
			.where(
				and(eq(mangaTable.sourceId, sourceId), eq(mangaTable.mangaId, mangaId))
			);

		if (res.rowsAffected === 0) {
			throw new Error(
				`Manga with ID ${mangaId} does not exist in source ${sourceId}`
			);
		}
	}
}

const appMangaService = new AppMangaService();

export { appMangaService, AppMangaService };
