import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { app } from "electron";
import { paths } from "./paths";

function pathToFileUrl(path: string): string {
	if (process.platform === "win32") {
		return `file:///${path.replace(/\\/g, "/")}`;
	}
	return `file://${path}`;
}

const dbPath = app.isPackaged ? paths.databasePath : paths.devDatabasePath;

const client = createClient({ url: pathToFileUrl(dbPath) });
const db = drizzle({ client });

export { db };
