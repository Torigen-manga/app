function getMimeType(ext: string): string {
	switch (ext) {
		case ".html":
			return "text/html";
		case ".js":
			return "text/javascript";
		case ".json":
			return "application/json";
		case ".css":
			return "text/css";
		case ".png":
			return "image/png";
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".svg":
			return "image/svg+xml";
		default:
			return "application/octet-stream";
	}
}

export { getMimeType };
