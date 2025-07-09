import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
	proxyFetch: (url: string, options?: RequestInit) =>
		ipcRenderer.invoke("proxy-fetch", url, options),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
