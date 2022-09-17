import { presetWind, presetAttributify } from "unocss";
import { defineNuxtConfig } from "nuxt/config";

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
		presets: [presetWind(), presetAttributify()],
		safelist: ["invisible"],
	},
	runtimeConfig: {
		googleApiKey: "",
	},
	vue: {
		config: {
			devtools: true,
		},
	},
});
