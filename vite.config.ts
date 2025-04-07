import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, "/index.html"),
				background: path.resolve(__dirname, "/background/index.ts"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
