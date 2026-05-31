import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const rawBase = env.VITE_BASE_PATH || "/";
	const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

	return {
		base,
		resolve: {
			tsconfigPaths: true,
			dedupe: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
				"@tanstack/react-query",
				"@tanstack/query-core",
			],
		},
		plugins: [
			tanstackStart({
				spa: {
					enabled: true,
					prerender: {
						outputPath: "/index.html",
						crawlLinks: true,
					},
				},
			}),
			tailwindcss(),
			react(),
		],
		build: {
			outDir: "dist",
		},
		environments: {
			client: {
				build: {
					outDir: "dist",
				},
			},
			ssr: {
				build: {
					outDir: ".build/server",
				},
			},
		},
		server: {
			host: true,
			port: 3000,
		},
	};
});
