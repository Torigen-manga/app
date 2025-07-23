import { appReadEntryTable, readLogs } from "@common/index";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";

class HistoryService {
	async markChapterAsRead(
		sourceId: string,
		mangaId: string,
		chapterId: string
	) {
		const now = new Date();

		const [entry] = await db
			.select()
			.from(appReadEntryTable)
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			);

		const readChapters = entry?.readChaptersIds || [];

		if (readChapters.includes(chapterId)) {
			throw new Error(
				`Chapter '${chapterId}' is already marked as read for manga '${mangaId}'`
			);
		}

		if (entry) {
			await db
				.update(appReadEntryTable)
				.set({
					readChaptersIds: [...readChapters, chapterId],
					lastReadChapterId: chapterId,
				})
				.where(
					and(
						eq(appReadEntryTable.sourceId, sourceId),
						eq(appReadEntryTable.mangaId, mangaId)
					)
				);
		} else {
			await db.insert(appReadEntryTable).values({
				sourceId,
				mangaId,
				readChaptersIds: [chapterId],
				lastReadChapterId: chapterId,
			});
		}

		const [existingLog] = await db
			.select()
			.from(readLogs)
			.where(
				and(
					eq(readLogs.sourceId, sourceId),
					eq(readLogs.mangaId, mangaId),
					eq(readLogs.chapterId, chapterId)
				)
			);

		if (existingLog) {
			throw new Error(
				`Read log already exists for chapter '${chapterId}' of manga '${mangaId}'`
			);
		}

		await db.insert(readLogs).values({
			sourceId,
			mangaId,
			chapterId,
			readAt: now,
		});
	}

	async getMangaReadEntry(sourceId: string, mangaId: string) {
		const [entry] = await db
			.select()
			.from(appReadEntryTable)
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			);
		return entry ?? null;
	}

	async unmarkChapterAsRead(
		sourceId: string,
		mangaId: string,
		chapterId: string
	) {
		const [entry] = await db
			.select()
			.from(appReadEntryTable)
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			);

		if (!entry) {
			return;
		}

		const newReadChapters =
			entry.readChaptersIds?.filter((id) => id !== chapterId) || [];

		const lastReadChapterId =
			entry.lastReadChapterId === chapterId
				? (newReadChapters.at(-1) ?? null)
				: entry.lastReadChapterId;

		await db
			.update(appReadEntryTable)
			.set({ readChaptersIds: newReadChapters, lastReadChapterId })
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			);

		await db
			.delete(readLogs)
			.where(
				and(
					eq(readLogs.sourceId, sourceId),
					eq(readLogs.mangaId, mangaId),
					eq(readLogs.chapterId, chapterId)
				)
			);
	}

	async clearMangaReadEntry(sourceId: string, mangaId: string) {
		await db
			.delete(appReadEntryTable)
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			);

		await db
			.delete(readLogs)
			.where(
				and(eq(readLogs.sourceId, sourceId), eq(readLogs.mangaId, mangaId))
			);
	}

	async clearSourceReadEntries(sourceId: string) {
		await db
			.delete(appReadEntryTable)
			.where(eq(appReadEntryTable.sourceId, sourceId));

		await db.delete(readLogs).where(eq(readLogs.sourceId, sourceId));
	}

	async clearAllReadEntries() {
		await db.delete(appReadEntryTable);
		await db.delete(readLogs);
	}
}

const historyService = new HistoryService();

export { historyService };
