import { defineNuxtConfig } from "nuxt";
import { presetWind, presetAttributify } from "unocss";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	meta: {
		title: "Quiz",
	},
	modules: [
		// ...
		"@pinia/nuxt",
		"@unocss/nuxt",
	],
	unocss: {
		// presets
		uno: true, // enabled `@unocss/preset-uno`
		icons: true, // enabled `@unocss/preset-icons`
		attributify: true, // enabled `@unocss/preset-attributify`,

		// core options
		shortcuts: [],
		rules: [],
		presets: [presetWind(), presetAttributify()],
	},
	nitro: {
		storage: {
			redis: {
				driver: "redis",
				/* redis connector options */
				port: 6379, // Redis port
				host: "127.0.0.1", // Redis host
				username: "", // needs Redis >= 6
				password: "",
				db: 1, // Defaults to 0
			},
		},
	},
});
