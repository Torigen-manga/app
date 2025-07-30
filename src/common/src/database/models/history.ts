import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

const appReadEntryTable = sqliteTable("app_read_entry", {
	sourceId: text("source_id").notNull(),
	mangaId: text("manga_id").notNull(),
	readChaptersIds: text("read_chapters_ids", { mode: "json" }).$type<
		string[]
	>(),
	lastReadChapterId: text("last_read_chapter_id"),
	lastReadAt: integer("last_read_at", { mode: "timestamp" }).notNull(),
});

const readLogs = sqliteTable(
	"read_logs",
	{
		sourceId: text("source_id").notNull(),
		mangaId: text("manga_id").notNull(),
		chapterId: text("chapter_id").notNull(),
		readAt: integer("read_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [primaryKey({ columns: [t.sourceId, t.mangaId, t.chapterId] })]
);

type AppReadEntry = typeof appReadEntryTable.$inferSelect;
type ReadLog = typeof readLogs.$inferSelect;

export { appReadEntryTable, readLogs };
export type { AppReadEntry, ReadLog };
