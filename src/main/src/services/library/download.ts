import { constants, createWriteStream } from "node:fs";
import { access, stat, unlink } from "node:fs/promises";
import { extname, join } from "node:path";
import { net } from "electron";
import { directories } from "../../paths";

async function fileExistsAndIsNonEmpty(filePath: string): Promise<boolean> {
	try {
		await access(filePath, constants.F_OK);

		const stats = await stat(filePath);

		if (stats.size === 0) {
			await unlink(filePath);
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

async function downloadCover(id: string, url: string): Promise<string> {
	const extension = extname(new URL(url).pathname) || ".jpg";
	const fileName = `${id}${extension}`;
	const filePath = join(directories.coverCacheDir, fileName);

	const exists = await fileExistsAndIsNonEmpty(filePath);

	if (exists) {
		return fileName;
	}

	return new Promise((resolve, reject) => {
		const request = net.request({ url });

		request.on("response", (response) => {
			if (response.statusCode !== 200) {
				return reject(
					new Error(`Failed to download cover: ${response.statusMessage}`)
				);
			}

			const fileStream = createWriteStream(filePath);

			fileStream.on("error", (err) => {
				fileStream.destroy();
				reject(err);
			});

			fileStream.on("finish", () => {
				resolve(fileName);
			});

			response.on("error", (err) => {
				fileStream.destroy();
				reject(err);
			});

			response.on("data", (chunk) => {
				fileStream.write(chunk);
			});

			response.on("end", () => {
				fileStream.end();
			});
		});

		request.on("error", (err) => {
			reject(err);
		});

		request.end();
	});
}

export { downloadCover };
