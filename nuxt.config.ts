// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		head: {
			meta: [
				{
					name: "Title",
					content: "Quiz",
				},
			],
		},
	},
	modules: ["@pinia/nuxt", "@unocss/nuxt", "nuxt-icon"],
	runtimeConfig: {
		googleApiKey: process.env.NUXT_GOOGLE_API_KEY,
		public: {
			dev: process.env.NODE_ENV !== "production",
		},
	},
});
