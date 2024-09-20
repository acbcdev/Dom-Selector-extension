import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, "/index.html"),
				content: path.resolve(__dirname, "/content/index.ts"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
