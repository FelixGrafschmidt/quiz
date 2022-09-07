import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
export default defineConfig({
	build: {
		minify: false,
	},
	optimizeDeps: {
		include: ["vue"],
	},
	plugins: [vue(), WindiCSS()],
	server: {
		port: 3000,
	},
});
