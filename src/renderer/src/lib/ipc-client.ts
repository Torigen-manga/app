import type { APIResponse } from "@common/index";
import { invoke } from "@renderer/lib/ipc-methods";

// biome-ignore lint/suspicious/noExplicitAny: This is a generic IPC client function
async function invokeIPC<T>(channel: string, ...args: any[]): Promise<T> {
	const res: APIResponse<T> = await invoke(channel, ...args);

	if (!res.success) {
		throw new Error(res.error);
	}

	return res.data;
}

export { invokeIPC };
