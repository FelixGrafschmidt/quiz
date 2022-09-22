import path from "path";
import { presetWind, presetAttributify } from "unocss";
import * as dotenv from "dotenv";
import { defineNuxtConfig } from "nuxt/config";
import { presetScrollbar } from "unocss-preset-scrollbar";
dotenv.config({ path: path.join(__dirname, ".env") });

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	meta: {
		title: "Quiz",
	},
	modules: ["@pinia/nuxt", "@unocss/nuxt", "nuxt-icon"],
	unocss: {
		// presets
		uno: true, // enabled `@unocss/preset-uno`
		icons: true, // enabled `@unocss/preset-icons`
		attributify: true, // enabled `@unocss/preset-attributify`,

		// core options
		shortcuts: [],
		rules: [],
		presets: [
			presetWind(),
			presetAttributify(),
			presetScrollbar({
				// config
			}),
		],
		safelist: ["invisible"],
	},
	runtimeConfig: {
		googleApiKey: process.env.NUXT_GOOGLE_API_KEY,
		public: {
			dev: process.env.NODE_ENV !== "production",
		},
	},
	vue: {
		config: {
			devtools: true,
		},
	},
});
