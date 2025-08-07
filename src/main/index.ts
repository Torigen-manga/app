import { createReadStream, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { getMimeType } from "@common/index";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, net, protocol, shell } from "electron";
import icon from "../../resources/icon.png?asset";
import {
	createCategoryHandlers,
	createExtensionHandlers,
	createExtensionsHandlers,
	createHistoryHandlers,
	createLibraryHandlers,
	createPreferencesHandlers,
	directories,
	ensureDatabase,
	ensureDirectoriesExist,
	ensureExtensionService,
} from "./src/index";

protocol.registerSchemesAsPrivileged([
	{
		scheme: "cover",
		privileges: {
			secure: true,
			stream: true,
			standard: true,
			corsEnabled: true,
			supportFetchAPI: true,
		},
	},
]);

function createWindow(): void {
	const mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		minWidth: 1024,
		minHeight: 768,
		show: false,
		frame: false,
		autoHideMenuBar: true,
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}

	ipcMain.handle("window:minimize", () => {
		mainWindow.minimize();
	});

	ipcMain.handle("window:maximize", () => {
		if (mainWindow.isMaximized()) {
			mainWindow.restore();
		} else {
			mainWindow.maximize();
		}
	});

	ipcMain.handle("window:close", () => {
		mainWindow.close();
	});
}

app.whenReady().then(async () => {
	electronApp.setAppUserModelId("com.electron");
	app.setAsDefaultProtocolClient("wtorigen");

	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	ipcMain.handle("proxy-fetch", async (_, url, options) => {
		try {
			const res = await net.fetch(url, {
				...options,
				headers: {
					...options.headers,
					"User-Agent": "Torigen/0.1.0",
				},
			});

			return {
				ok: res.ok,
				status: res.status,
				statusText: res.statusText,
				headers: Object.fromEntries(res.headers.entries()),
				body: await res.text(),
			};
		} catch (err) {
			return {
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				error: err instanceof Error ? err.message : String(err),
			};
		}
	});

	await ensureDirectoriesExist();
	await ensureDatabase();

	protocol.handle("cover", (req) => {
		const url = new URL(req.url);
		const fileName = url.hostname + (url.pathname === "/" ? "" : url.pathname);

		const filePath = join(
			directories.coverCacheDir,
			decodeURIComponent(fileName)
		);

		if (!existsSync(filePath)) {
			return new Response(null, {
				status: 404,
				statusText: "Not Found",
			});
		}

		const stream = createReadStream(filePath);
		const extension = extname(fileName);
		const mimeType = getMimeType(extension);

		return new Response(stream as unknown as BodyInit, {
			status: 200,
			headers: {
				"Content-Type": mimeType,
				"Access-Control-Allow-Origin": "*",
			},
		});
	});

	ensureExtensionService();

	createLibraryHandlers();
	createCategoryHandlers();
	createExtensionsHandlers();
	createPreferencesHandlers();
	createExtensionHandlers();
	createHistoryHandlers();

	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
