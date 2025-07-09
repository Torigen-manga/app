interface IPCResponse {
	ok: boolean;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	error?: string;
}

export type { IPCResponse };
