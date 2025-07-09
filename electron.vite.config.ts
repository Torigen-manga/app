import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
	main: {
		resolve: {
			alias: {
				"@common": resolve("src/common"),
			},
		},
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: {
			alias: {
				"@renderer": resolve("src/renderer/src"),
				"@common": resolve("src/common"),
			},
		},
		plugins: [react()],
	},
});
