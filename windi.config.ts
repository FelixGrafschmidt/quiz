import { defineConfig } from "windicss/helpers";

export default defineConfig({
	theme: {},
	extract: {
		include: ["**/*.{vue,html,jsx,tsx,ts,js}"],
	},
	variants: {},
});
