import type { IPCResponse } from "@common/types/ipcResponse";
import type { ElectronAPI } from "@electron-toolkit/preload";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			proxyFetch: (url: string, options: RequestInit) => Promise<IPCResponse>;
		};
	}
}
