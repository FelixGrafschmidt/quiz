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
	nitro: {
		storage: {
			redis: {
				driver: "redis",
				/* redis connector options */
				port: process.env.REDIS_PORT || 6378, // Redis port
				host: "127.0.0.1", // Redis host
				username: "", // needs Redis >= 6
				password: "",
				db: 1, // Defaults to 0
			},
		},
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
