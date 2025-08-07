import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type {
	AppLibrary,
	AppManga,
	CategoryRefreshProgress,
	LibraryEntryTable,
	LibraryEntryWithUnreadCount,
	LibraryRefreshProgress,
	MangaUpdateResult,
} from "@common/index";
import {
	appReadEntryTable,
	categoryTable,
	libraryEntryTable,
	libraryEntryWithCategoryTable,
} from "@common/index";
import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "../../db";
import { directories } from "../../paths";
import { type AppMangaService, appMangaService } from "../core";
import { extensionService } from "../extension";
import { downloadCover } from "./download";

interface LibraryEntryWithCategories extends LibraryEntryTable {
	categories?: string[];
}

class LibraryService {
	readonly appService: AppMangaService;
	private refreshProgressCallback?: (progress: LibraryRefreshProgress) => void;
	private isCurrentlyRefreshing = false;

	constructor(appService: AppMangaService) {
		this.appService = appService;
	}

	setRefreshProgressCallback(
		callback: (progress: LibraryRefreshProgress) => void
	) {
		this.refreshProgressCallback = callback;
	}

	private emitProgress(progress: LibraryRefreshProgress) {
		if (this.refreshProgressCallback) {
			this.refreshProgressCallback(progress);
		}
	}

	async refreshAllLibrary(): Promise<LibraryRefreshProgress> {
		if (this.isCurrentlyRefreshing) {
			throw new Error("Library refresh is already in progress");
		}

		this.isCurrentlyRefreshing = true;

		try {
			const library = await this.getLibrary();
			const { entries, categories } = library;

			const entryCategories = new Map<string, LibraryEntryWithCategories[]>();
			const uncategorizedEntries: LibraryEntryWithCategories[] = [];

			for (const category of categories) {
				entryCategories.set(category.id, []);
			}

			for (const entry of entries as LibraryEntryWithCategories[]) {
				if (entry.categories && entry.categories.length > 0) {
					for (const categoryId of entry.categories) {
						const categoryEntries = entryCategories.get(categoryId) || [];
						categoryEntries.push(entry);
						entryCategories.set(categoryId, categoryEntries);
					}
				} else {
					uncategorizedEntries.push(entry);
				}
			}

			if (uncategorizedEntries.length > 0) {
				entryCategories.set("uncategorized", uncategorizedEntries);
			}

			return await this.processRefreshWithProgress(
				entryCategories,
				categories,
				entries.length
			);
		} finally {
			this.isCurrentlyRefreshing = false;
		}
	}

	private async processRefreshWithProgress(
		entryCategories: Map<string, LibraryEntryWithCategories[]>,
		categories: { id: string; name: string; order: number }[],
		totalEntries: number
	): Promise<LibraryRefreshProgress> {
		const categoryProgress = this.initializeCategoryProgress(
			entryCategories,
			categories
		);

		const initialProgress: LibraryRefreshProgress = {
			isRefreshing: true,
			overallProgress: {
				completed: 0,
				total: totalEntries,
				errors: 0,
			},
			categories: categoryProgress,
		};

		this.emitProgress(initialProgress);

		const result = await this.processAllCategories(
			entryCategories,
			categoryProgress,
			totalEntries
		);

		const finalProgress: LibraryRefreshProgress = {
			isRefreshing: false,
			overallProgress: {
				completed: result.completedEntries,
				total: totalEntries,
				errors: result.totalErrors,
			},
			categories: categoryProgress,
		};

		this.emitProgress(finalProgress);
		return finalProgress;
	}

	private initializeCategoryProgress(
		entryCategories: Map<string, LibraryEntryWithCategories[]>,
		categories: { id: string; name: string; order: number }[]
	): CategoryRefreshProgress[] {
		const categoryProgress: CategoryRefreshProgress[] = [];

		for (const [categoryId, categoryEntries] of entryCategories) {
			const categoryName =
				categoryId === "uncategorized"
					? "Uncategorized"
					: categories.find((c) => c.id === categoryId)?.name || "Unknown";

			categoryProgress.push({
				categoryId,
				categoryName,
				total: categoryEntries.length,
				completed: 0,
				errors: 0,
				isComplete: false,
				entries: categoryEntries.map((entry) => ({
					entryId: entry.id,
					title: entry.title,
					status: "pending",
				})),
			});
		}

		return categoryProgress;
	}

	private async processAllCategories(
		entryCategories: Map<string, LibraryEntryWithCategories[]>,
		categoryProgress: CategoryRefreshProgress[],
		totalEntries: number
	): Promise<{ completedEntries: number; totalErrors: number }> {
		let completedEntries = 0;
		let totalErrors = 0;

		for (const [categoryId, categoryEntries] of entryCategories) {
			const categoryIndex = categoryProgress.findIndex(
				(c) => c.categoryId === categoryId
			);
			if (categoryIndex === -1) {
				continue;
			}

			// biome-ignore lint/nursery/noAwaitInLoop: Important
			const progressResult = await this.processCategoryEntries(
				categoryId,
				categoryEntries,
				categoryProgress,
				categoryIndex,
				completedEntries,
				totalErrors,
				totalEntries
			);

			completedEntries = progressResult.completedEntries;
			totalErrors = progressResult.totalErrors;

			categoryProgress[categoryIndex].isComplete = true;
		}

		return { completedEntries, totalErrors };
	}

	private async processCategoryEntries(
		categoryId: string,
		categoryEntries: LibraryEntryWithCategories[],
		categoryProgress: CategoryRefreshProgress[],
		categoryIndex: number,
		initialCompletedEntries: number,
		initialTotalErrors: number,
		totalEntries: number
	): Promise<{ completedEntries: number; totalErrors: number }> {
		let completedEntries = initialCompletedEntries;
		let totalErrors = initialTotalErrors;
		const currentCategoryProgress = categoryProgress[categoryIndex];

		this.emitProgress({
			isRefreshing: true,
			overallProgress: {
				completed: completedEntries,
				total: totalEntries,
				errors: totalErrors,
			},
			categories: [...categoryProgress],
			currentCategory: categoryId,
		});

		for (const entry of categoryEntries) {
			const entryIndex = currentCategoryProgress.entries.findIndex(
				(e) => e.entryId === entry.id
			);

			if (entryIndex !== -1) {
				currentCategoryProgress.entries[entryIndex].status = "updating";
				this.emitProgress({
					isRefreshing: true,
					overallProgress: {
						completed: completedEntries,
						total: totalEntries,
						errors: totalErrors,
					},
					categories: [...categoryProgress],
					currentCategory: categoryId,
				});

				try {
					// biome-ignore lint/nursery/noAwaitInLoop: Important
					await this.updateSingleMangaMetadata(entry);

					currentCategoryProgress.entries[entryIndex].status = "completed";
					currentCategoryProgress.completed++;
					completedEntries++;
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : "Unknown error";
					currentCategoryProgress.entries[entryIndex].status = "error";
					currentCategoryProgress.entries[entryIndex].error = errorMessage;
					currentCategoryProgress.errors++;
					totalErrors++;
				}

				this.emitProgress({
					isRefreshing: true,
					overallProgress: {
						completed: completedEntries,
						total: totalEntries,
						errors: totalErrors,
					},
					categories: [...categoryProgress],
					currentCategory: categoryId,
				});
			}
		}

		return { completedEntries, totalErrors };
	}

	async refreshCategory(categoryId: string): Promise<CategoryRefreshProgress> {
		if (this.isCurrentlyRefreshing) {
			throw new Error("Library refresh is already in progress");
		}

		const entries =
			categoryId === "all"
				? await this.getEntries()
				: await this.getEntriesByCategory(categoryId);

		const categories = await db.select().from(categoryTable);
		const categoryName =
			categoryId === "all"
				? "All Entries"
				: categories.find((c) => c.id === categoryId)?.name || "Unknown";

		const categoryProgress: CategoryRefreshProgress = {
			categoryId,
			categoryName,
			total: entries.length,
			completed: 0,
			errors: 0,
			isComplete: false,
			entries: entries.map((entry) => ({
				entryId: entry.id,
				title: entry.title,
				status: "pending",
			})),
		};

		for (const entry of entries) {
			const entryIndex = categoryProgress.entries.findIndex(
				(e) => e.entryId === entry.id
			);

			if (entryIndex !== -1) {
				categoryProgress.entries[entryIndex].status = "updating";

				try {
					// biome-ignore lint/nursery/noAwaitInLoop: Important
					await this.updateSingleMangaMetadata(entry);

					categoryProgress.entries[entryIndex].status = "completed";
					categoryProgress.completed++;
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : "Unknown error";
					categoryProgress.entries[entryIndex].status = "error";
					categoryProgress.entries[entryIndex].error = errorMessage;
					categoryProgress.errors++;
				}
			}
		}

		categoryProgress.isComplete = true;
		return categoryProgress;
	}

	private async updateSingleMangaMetadata(
		entry: LibraryEntryTable
	): Promise<MangaUpdateResult> {
		const { sourceId, mangaId, id, title } = entry;

		try {
			const mangaDetails = await extensionService.getMangaDetails(
				sourceId,
				mangaId
			);
			const mangaChapters = await extensionService.getMangaChapters(
				sourceId,
				mangaId
			);

			const updatedFields: MangaUpdateResult["updatedFields"] = {};
			const updates: Partial<AppManga> = {};

			if (mangaDetails.title && mangaDetails.title !== title) {
				updates.title = mangaDetails.title;
				updatedFields.title = true;
			}

			if (mangaDetails.image && mangaDetails.image !== entry.cover) {
				try {
					const newCoverPath = `cover://${await downloadCover(id, mangaDetails.image)}`;
					updates.cover = newCoverPath;
					updatedFields.cover = true;
				} catch {
					updates.cover = mangaDetails.image;
					updatedFields.cover = true;
				}
			}

			const newChapterCount = mangaChapters.length;
			if (newChapterCount !== entry.cachedTotalChapters) {
				await db
					.update(libraryEntryTable)
					.set({ cachedTotalChapters: newChapterCount })
					.where(eq(libraryEntryTable.id, id));
				updatedFields.chapterCount = true;
			}

			if (Object.keys(updates).length > 0) {
				await this.appService.updateManga(sourceId, mangaId, updates);
			}

			const libraryUpdates: Partial<LibraryEntryTable> = {};
			if (updates.title) {
				libraryUpdates.title = updates.title;
			}
			if (updates.cover) {
				libraryUpdates.cover = updates.cover;
			}

			if (Object.keys(libraryUpdates).length > 0) {
				await this.updateMangaMetadata(id, libraryUpdates);
			}

			return {
				entryId: id,
				title,
				success: true,
				updatedFields,
			};
		} catch (error) {
			return {
				entryId: id,
				title,
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	isRefreshing(): boolean {
		return this.isCurrentlyRefreshing;
	}

	async getLibraryWithUnreadCounts(): Promise<LibraryEntryWithUnreadCount[]> {
		const entries = await this.getEntries();
		const entriesWithUnread: LibraryEntryWithUnreadCount[] = [];

		for (const entry of entries) {
			// biome-ignore lint/nursery/noAwaitInLoop: Important
			const readEntry = await db
				.select()
				.from(appReadEntryTable)
				.where(
					and(
						eq(appReadEntryTable.sourceId, entry.sourceId),
						eq(appReadEntryTable.mangaId, entry.mangaId)
					)
				)
				.then((r) => r[0]);

			const readChaptersCount = readEntry?.readChaptersIds?.length || 0;
			const totalChapters = entry.cachedTotalChapters || 0;
			const unreadCount = Math.max(0, totalChapters - readChaptersCount);

			entriesWithUnread.push({
				...entry,
				readChaptersCount,
				unreadCount,
				lastRefreshAt: new Date(),
			});
		}

		return entriesWithUnread;
	}

	async getUnreadCount(sourceId: string, mangaId: string): Promise<number> {
		const entry = await db
			.select()
			.from(libraryEntryTable)
			.where(
				and(
					eq(libraryEntryTable.sourceId, sourceId),
					eq(libraryEntryTable.mangaId, mangaId)
				)
			)
			.then((r) => r[0]);

		if (!entry) {
			return 0;
		}

		const readEntry = await db
			.select()
			.from(appReadEntryTable)
			.where(
				and(
					eq(appReadEntryTable.sourceId, sourceId),
					eq(appReadEntryTable.mangaId, mangaId)
				)
			)
			.then((r) => r[0]);

		const readChaptersCount = readEntry?.readChaptersIds?.length || 0;
		const totalChapters = entry.cachedTotalChapters || 0;

		return Math.max(0, totalChapters - readChaptersCount);
	}

	async getLibrary(): Promise<AppLibrary> {
		const entriesRaw = await db.select().from(libraryEntryTable);
		const categories = await db.select().from(categoryTable);
		const entryCategories = await db
			.select()
			.from(libraryEntryWithCategoryTable);

		const idToCategories = new Map<string, string[]>();

		for (const ec of entryCategories) {
			if (!idToCategories.has(ec.libraryEntryId)) {
				idToCategories.set(ec.libraryEntryId, []);
			}
			const categoryList = idToCategories.get(ec.libraryEntryId);
			if (categoryList) {
				categoryList.push(ec.categoryId);
			}
		}

		const entries: LibraryEntryTable[] = entriesRaw.map((entry) => ({
			...entry,
			categories: idToCategories.get(entry.id) ?? [],
		}));

		return {
			entries,
			categories,
		};
	}

	async clearLibrary(): Promise<void> {
		await db.delete(libraryEntryWithCategoryTable);
		await db.delete(libraryEntryTable);
	}

	async addMangaToLibrary(data: AppManga): Promise<void> {
		const { sourceId, mangaId, cover, title } = data;
		const id = `${sourceId}__${mangaId}`;

		const existing = await db
			.select()
			.from(libraryEntryTable)
			.where(eq(libraryEntryTable.id, id))
			.limit(1)
			.then((r) => r[0]);

		if (existing) {
			return;
		}

		let coverPath: string;

		try {
			coverPath = `cover://${await downloadCover(id, cover)}`;
		} catch {
			coverPath = cover;
		}

		await db.insert(libraryEntryTable).values({
			id,
			sourceId,
			mangaId,
			title,
			cover: coverPath,
			addedAt: new Date(),
			cachedTotalChapters: 0,
		});

		const manga = await this.appService.getMangaById(sourceId, mangaId);
		if (!manga) {
			await this.appService.addManga(data);
		}
	}

	async removeMangaFromLibrary(id: string): Promise<void> {
		const entry = await db
			.select()
			.from(libraryEntryTable)
			.where(eq(libraryEntryTable.id, id))
			.then((r) => r[0]);

		if (!entry) {
			return;
		}

		if (entry.cover.startsWith("cover://")) {
			const fileName = entry.cover.replace("cover://", "");
			const filePath = join(directories.coverCacheDir, fileName);
			await unlink(filePath);
		}

		await db
			.delete(libraryEntryWithCategoryTable)
			.where(eq(libraryEntryWithCategoryTable.libraryEntryId, id));

		await db.delete(libraryEntryTable).where(eq(libraryEntryTable.id, id));
	}

	async getEntries(): Promise<LibraryEntryTable[]> {
		const entriesRaw = await db.select().from(libraryEntryTable);
		const entryCategories = await db
			.select()
			.from(libraryEntryWithCategoryTable);

		const idToCategories = new Map<string, string[]>();

		for (const ec of entryCategories) {
			if (!idToCategories.has(ec.libraryEntryId)) {
				idToCategories.set(ec.libraryEntryId, []);
			}
			const categoryList = idToCategories.get(ec.libraryEntryId);
			if (categoryList) {
				categoryList.push(ec.categoryId);
			}
		}

		return entriesRaw.map((entry) => ({
			...entry,
			categories: idToCategories.get(entry.id) ?? [],
		}));
	}

	async getEntriesByCategory(categoryId: string): Promise<LibraryEntryTable[]> {
		const entries = await db
			.select()
			.from(libraryEntryTable)
			.innerJoin(
				libraryEntryWithCategoryTable,
				eq(libraryEntryTable.id, libraryEntryWithCategoryTable.libraryEntryId)
			)
			.where(eq(libraryEntryWithCategoryTable.categoryId, categoryId))
			.then((r) => r.map((entry) => entry.library_entry));

		const entryCategoryData = await db
			.select()
			.from(libraryEntryWithCategoryTable);
		const idToCategories = new Map<string, string[]>();

		for (const ec of entryCategoryData) {
			if (!idToCategories.has(ec.libraryEntryId)) {
				idToCategories.set(ec.libraryEntryId, []);
			}
			const categoryList = idToCategories.get(ec.libraryEntryId);
			if (categoryList) {
				categoryList.push(ec.categoryId);
			}
		}

		return entries.map((entry) => ({
			...entry,
			categories: idToCategories.get(entry.id) ?? [],
		}));
	}

	async hasEntry(sourceId: string, mangaId: string): Promise<boolean> {
		const entry = await db
			.select({ id: libraryEntryTable.id })
			.from(libraryEntryTable)
			.where(
				and(
					eq(libraryEntryTable.sourceId, sourceId),
					eq(libraryEntryTable.mangaId, mangaId)
				)
			)
			.limit(1)
			.then((r) => r[0]);

		return !!entry;
	}

	async updateMangaMetadata(
		id: string,
		updates: Partial<AppManga>
	): Promise<void> {
		// biome-ignore lint/suspicious/noExplicitAny: Necessary for flexibility
		const updateData: any = {};

		if (updates.title) {
			updateData.title = updates.title;
		}
		if (updates.cover) {
			updateData.cover = updates.cover;
		}

		if (Object.keys(updateData).length > 0) {
			await db
				.update(libraryEntryTable)
				.set(updateData)
				.where(eq(libraryEntryTable.id, id));
		}
	}
}

class CategoryService {
	async addCategory(name: string): Promise<string> {
		const existing = await db
			.select()
			.from(categoryTable)
			.where(eq(categoryTable.name, name))
			.then((r) => r[0]);

		if (existing) {
			throw new Error(`Category "${name}" already exists.`);
		}

		const maxOrder = await db
			.select({ maxOrder: sql<number>`MAX("order")` })
			.from(categoryTable)
			.then((r) => r[0]?.maxOrder ?? -1);

		const nextOrder = maxOrder + 1;
		const id = crypto.randomUUID();

		await db.insert(categoryTable).values({ id, name, order: nextOrder });

		return id;
	}

	async renameCategory(id: string, newName: string): Promise<void> {
		const category = await db
			.select()
			.from(categoryTable)
			.where(eq(categoryTable.id, id))
			.then((r) => r[0]);

		if (!category) {
			throw new Error(`Category with ID "${id}" does not exist.`);
		}

		const existing = await db
			.select()
			.from(categoryTable)
			.where(and(eq(categoryTable.name, newName), ne(categoryTable.id, id)))
			.then((r) => r[0]);

		if (existing) {
			throw new Error(`Category "${newName}" already exists.`);
		}

		await db
			.update(categoryTable)
			.set({ name: newName })
			.where(eq(categoryTable.id, id));
	}

	async removeCategory(id: string): Promise<void> {
		await db
			.delete(libraryEntryWithCategoryTable)
			.where(eq(libraryEntryWithCategoryTable.categoryId, id));
		await db.delete(categoryTable).where(eq(categoryTable.id, id));
	}

	async addCategoryToEntry(
		categoryId: string,
		libraryEntryId: string
	): Promise<void> {
		const entry = await db
			.select()
			.from(libraryEntryTable)
			.where(eq(libraryEntryTable.id, libraryEntryId))
			.then((r) => r[0]);

		if (!entry) {
			throw new Error(
				`Library entry with ID "${libraryEntryId}" does not exist.`
			);
		}

		const category = await db
			.select()
			.from(categoryTable)
			.where(eq(categoryTable.id, categoryId))
			.then((r) => r[0]);

		if (!category) {
			throw new Error(`Category with ID "${categoryId}" does not exist.`);
		}

		const existing = await db
			.select()
			.from(libraryEntryWithCategoryTable)
			.where(
				and(
					eq(libraryEntryWithCategoryTable.libraryEntryId, libraryEntryId),
					eq(libraryEntryWithCategoryTable.categoryId, categoryId)
				)
			)
			.then((r) => r[0]);

		if (existing) {
			return;
		}

		await db.insert(libraryEntryWithCategoryTable).values({
			libraryEntryId,
			categoryId,
		});
	}

	async removeCategoryFromEntry(
		categoryId: string,
		entryId: string
	): Promise<void> {
		await db
			.delete(libraryEntryWithCategoryTable)
			.where(
				and(
					eq(libraryEntryWithCategoryTable.categoryId, categoryId),
					eq(libraryEntryWithCategoryTable.libraryEntryId, entryId)
				)
			);
	}

	async updateCategoryOrder(categoryId: string[]): Promise<void> {
		await db.transaction(async (tx) => {
			const updatePromises = categoryId.map((id, i) =>
				tx
					.update(categoryTable)
					.set({ order: i })
					.where(eq(categoryTable.id, id))
			);

			await Promise.all(updatePromises);
		});
	}
}

const libraryService = new LibraryService(appMangaService);
const categoryService = new CategoryService();

export { libraryService, categoryService };
