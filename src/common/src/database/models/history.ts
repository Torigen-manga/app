import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const appReadEntryTable = sqliteTable(
	"app_read_entry",
	{
		sourceId: text("source_id").notNull(),
		mangaId: text("manga_id").notNull(),
		readChaptersIds: text("read_chapters_ids", { mode: "json" }).$type<
			string[]
		>(),
		lastReadChapterId: text("last_read_chapter_id"),
		lastReadAt: integer("last_read_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [primaryKey({ columns: [t.sourceId, t.mangaId] })]
);

export const readLogs = sqliteTable(
	"read_logs",
	{
		sourceId: text("source_id").notNull(),
		mangaId: text("manga_id").notNull(),
		chapterId: text("chapter_id").notNull(),
		chapterNumber: integer("chapter_number").notNull(),
		pageNumber: integer("page_number").notNull(),
		isComplete: integer("is_complete", { mode: "boolean" }).notNull(),
		readAt: integer("read_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [primaryKey({ columns: [t.sourceId, t.mangaId, t.chapterId] })]
);

export type AppReadEntry = typeof appReadEntryTable.$inferSelect;
export type ReadLog = typeof readLogs.$inferSelect;
export type ReadLogReturnal = Omit<ReadLog, "sourceId" | "mangaId">;
