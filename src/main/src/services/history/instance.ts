import {
	type AppManga,
	appReadEntryTable,
	type HistoryEntryWithData,
	type ReadEntryWithData,
	type ReadLogReturnal,
	readLogs,
} from "@common/index";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { type AppMangaService, appMangaService } from "../core";

class HistoryService {
	readonly appService: AppMangaService;

	constructor(appService: AppMangaService) {
		this.appService = appService;
	}

	async markChapterAsRead(
		data: AppManga,
		chapterId: string,
		chapterNumber: number,
		pageNumber: number,
		isComplete = false
	): Promise<void> {
		const { sourceId, mangaId } = data;

		const now = new Date();

		const existing = await this.appService.getMangaById(sourceId, mangaId);

		if (!existing) {
			await this.appService.addManga(data);
		}

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
		const isAlreadyRead = readChapters.includes(chapterId);

		const updatedReadChapters =
			isComplete && !isAlreadyRead
				? [...readChapters, chapterId]
				: readChapters;

		if (entry) {
			await db
				.update(appReadEntryTable)
				.set({
					readChaptersIds: updatedReadChapters,
					lastReadChapterId: chapterId,
					lastReadAt: now,
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
				lastReadAt: now,
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
			await db
				.update(readLogs)
				.set({
					readAt: now,
					chapterNumber,
					pageNumber,
					isComplete,
				})
				.where(
					and(
						eq(readLogs.sourceId, sourceId),
						eq(readLogs.mangaId, mangaId),
						eq(readLogs.chapterId, chapterId)
					)
				);
		} else {
			await db.insert(readLogs).values({
				sourceId,
				mangaId,
				chapterId,
				chapterNumber,
				pageNumber,
				isComplete,
				readAt: now,
			});
		}
	}

	async getReadEntries(): Promise<ReadEntryWithData[]> {
		const entries = await db
			.select()
			.from(appReadEntryTable)
			.orderBy(desc(appReadEntryTable.lastReadAt));

		if (entries.length === 0) {
			return [];
		}

		const keys = entries.map((e) => ({
			sourceId: e.sourceId,
			mangaId: e.mangaId,
		}));

		const metadataList = await this.appService.getManyByKeys(keys);

		const metadataMap = new Map(
			metadataList.map((m) => [`${m.sourceId}_${m.mangaId}`, m])
		);

		return entries.map((e) => ({
			log: e,
			data: metadataMap.get(`${e.sourceId}_${e.mangaId}`) ?? null,
		}));
	}

	async getHistoryEntries(): Promise<HistoryEntryWithData[]> {
		const logs = await db
			.select()
			.from(readLogs)
			.orderBy(desc(readLogs.readAt));

		if (logs.length === 0) {
			return [];
		}

		const uniqueKeys = new Map<string, { sourceId: string; mangaId: string }>();

		for (const l of logs) {
			const key = `${l.sourceId}_${l.mangaId}`;
			if (!uniqueKeys.has(key)) {
				uniqueKeys.set(key, { sourceId: l.sourceId, mangaId: l.mangaId });
			}
		}

		const metadataList = await this.appService.getManyByKeys([
			...uniqueKeys.values(),
		]);

		const metadataMap = new Map(
			metadataList.map((m) => [`${m.sourceId}_${m.mangaId}`, m])
		);

		return logs.map((l) => ({
			log: l,
			data: metadataMap.get(`${l.sourceId}_${l.mangaId}`) ?? null,
		}));
	}

	async getMangaReadLogs(
		sourceId: string,
		mangaId: string
	): Promise<ReadLogReturnal[]> {
		const log = await db
			.select({
				chapterId: readLogs.chapterId,
				chapterNumber: readLogs.chapterNumber,
				pageNumber: readLogs.pageNumber,
				isComplete: readLogs.isComplete,
				readAt: readLogs.readAt,
			})
			.from(readLogs)
			.where(
				and(eq(readLogs.sourceId, sourceId), eq(readLogs.mangaId, mangaId))
			);

		return log;
	}

	async unmarkChapterAsRead(
		sourceId: string,
		mangaId: string,
		chapterId: string
	): Promise<void> {
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

	async clearMangaReadEntry(sourceId: string, mangaId: string): Promise<void> {
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

	async clearSourceReadEntries(sourceId: string): Promise<void> {
		await db
			.delete(appReadEntryTable)
			.where(eq(appReadEntryTable.sourceId, sourceId));

		await db.delete(readLogs).where(eq(readLogs.sourceId, sourceId));
	}

	async clearAllReadEntries(): Promise<void> {
		await db.delete(appReadEntryTable);
		await db.delete(readLogs);
	}

	async bulkMarkChaptersAsRead(
		data: AppManga,
		chapters: Array<{ chapterId: string; chapterNumber: number }>
	): Promise<void> {
		const { sourceId, mangaId } = data;
		const now = new Date();

		const existing = await this.appService.getMangaById(sourceId, mangaId);
		if (!existing) {
			await this.appService.addManga(data);
		}

		const [entry] = await db
			.select()
			.from(appReadEntryTable)
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			);

		const existingReadChapters = entry?.readChaptersIds || [];
		const newChapterIds = chapters.map((c) => c.chapterId);
		const allReadChapters = [
			...new Set([...existingReadChapters, ...newChapterIds]),
		];
		const lastChapterId = newChapterIds.at(-1) || entry?.lastReadChapterId;

		if (entry) {
			await db
				.update(appReadEntryTable)
				.set({
					readChaptersIds: allReadChapters,
					lastReadChapterId: lastChapterId,
					lastReadAt: now,
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
				readChaptersIds: allReadChapters,
				lastReadChapterId: lastChapterId,
				lastReadAt: now,
			});
		}

		const logValues = chapters.map(({ chapterId, chapterNumber }) => ({
			sourceId,
			mangaId,
			chapterId,
			chapterNumber,
			pageNumber: 0,
			isComplete: true,
			readAt: now,
		}));

		if (newChapterIds.length > 0) {
			await db
				.delete(readLogs)
				.where(
					and(
						eq(readLogs.sourceId, sourceId),
						eq(readLogs.mangaId, mangaId),
						inArray(readLogs.chapterId, newChapterIds)
					)
				);
		}

		await db.insert(readLogs).values(logValues);
	}

	async bulkUnmarkChaptersAsRead(
		sourceId: string,
		mangaId: string,
		chapterIds: string[]
	): Promise<void> {
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
			entry.readChaptersIds?.filter((id) => !chapterIds.includes(id)) || [];
		const lastReadChapterId = chapterIds.includes(entry.lastReadChapterId || "")
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

		if (chapterIds.length > 0) {
			await db
				.delete(readLogs)
				.where(
					and(
						eq(readLogs.sourceId, sourceId),
						eq(readLogs.mangaId, mangaId),
						inArray(readLogs.chapterId, chapterIds)
					)
				);
		}
	}
}

const historyService = new HistoryService(appMangaService);

export { historyService };
