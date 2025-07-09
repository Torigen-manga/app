import type { AppRequest, RequestManager } from "@torigen/mounter";

export class ProxyFetch implements RequestManager {
	async fetch(req: AppRequest): Promise<Response> {
		try {
			const url = this.buildUrl(req);
			const options = this.buildRequestOptions(req);

			return await fetch(url, options);
		} catch {
			throw new Error("Failed to fetch URL");
		}
	}

	private buildUrl(req: AppRequest): string {
		if (req.method !== "GET" || !req.params) {
			return req.url;
		}

		const urlParams = this.buildUrlParams(req.params);
		const queryString = urlParams.toString();

		if (!queryString) {
			return req.url;
		}

		const separator = req.url.includes("?") ? "&" : "?";
		return `${req.url}${separator}${queryString}`;
	}
	// biome-ignore lint/suspicious/noExplicitAny: Necessary for flexibility
	private buildUrlParams(params: Record<string, any>): URLSearchParams {
		const urlParams = new URLSearchParams();

		for (const [key, value] of Object.entries(params)) {
			if (Array.isArray(value)) {
				for (const item of value) {
					urlParams.append(key, String(item));
				}
			} else if (value !== undefined && value !== null) {
				urlParams.append(key, String(value));
			}
		}

		return urlParams;
	}

	private buildRequestOptions(req: AppRequest): RequestInit {
		const options: RequestInit = {
			method: req.method,
			headers: req.headers,
		};

		this.addRequestBody(req, options);
		return options;
	}

	private addRequestBody(req: AppRequest, options: RequestInit): void {
		const isBodyMethod = ["POST", "PUT", "PATCH"].includes(req.method);

		if (!isBodyMethod) {
			return;
		}

		if (req.data) {
			this.setBodyFromData(req.data, options);
		} else if (req.params) {
			this.setBodyFromParams(req.params, options);
		}
	}
	// biome-ignore lint/suspicious/noExplicitAny: Necessary for flexibility
	private setBodyFromData(data: any, options: RequestInit): void {
		if (typeof data === "object") {
			options.body = JSON.stringify(data);
			this.setJsonHeaders(options);
		} else {
			options.body = data;
		}
	}

	private setBodyFromParams(
		// biome-ignore lint/suspicious/noExplicitAny: Necessary for flexibility
		params: Record<string, any>,
		options: RequestInit
	): void {
		options.body = JSON.stringify(params);
		this.setJsonHeaders(options);
	}

	private setJsonHeaders(options: RequestInit): void {
		options.headers = {
			"Content-Type": "application/json",
			...options.headers,
		};
	}
}
