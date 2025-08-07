import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";

const api = {};

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Handle any errors that occur during the context bridge setup
		console.error(error);
	}
} else {
	// @ts-expect-error (define in dts)
	window.electron = electronAPI;
	// @ts-expect-error (define in dts)
	window.api = api;
}
