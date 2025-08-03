import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type { AppLibrary, AppManga, LibraryEntryTable } from "@common/index";
import {
	categoryTable,
	libraryEntryTable,
	libraryEntryWithCategoryTable,
} from "@common/index";
import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "../../db";
import { directories } from "../../paths";
import { type AppMangaService, appMangaService } from "../core";
import { downloadCover } from "./download";

interface RefreshProgress {
	current: number;
	total: number;
	currentEntry: {
		title: string;
		sourceId: string;
	};
	errors: Array<{
		entryId: string;
		title: string;
		error: string;
	}>;
}

//biome-ignore lint/correctness/noUnusedVariables: Not used for now
interface LibraryEntryWithUnreadCount extends LibraryEntryTable {
	readChaptersCount: number;
	unreadCount: number;
	lastRefreshAt?: Date;
}

class LibraryService {
	readonly appService: AppMangaService;
	private refreshProgressCallback?: (progress: RefreshProgress) => void;

	constructor(appService: AppMangaService) {
		this.appService = appService;
	}

	setRefreshProgressCallback(callback: (progress: RefreshProgress) => void) {
		this.refreshProgressCallback = callback;
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

		// Insert the new entry
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

		// Update the category name
		await db
			.update(categoryTable)
			.set({ name: newName })
			.where(eq(categoryTable.id, id));
	}

	async removeCategory(id: string): Promise<void> {
		// Remove all category associations first
		await db
			.delete(libraryEntryWithCategoryTable)
			.where(eq(libraryEntryWithCategoryTable.categoryId, id));

		// Then remove the category
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
