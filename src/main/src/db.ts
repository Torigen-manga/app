import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { paths } from "./paths";

function pathToFileUrl(path: string): string {
	if (process.platform === "win32") {
		return `file:///${path.replace(/\\/g, "/")}`;
	}
	return `file://${path}`;
}

const client = createClient({ url: pathToFileUrl(paths.devDatabasePath) });
const db = drizzle({ client });

export { db };
