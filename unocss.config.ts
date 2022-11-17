import { presetWind, presetAttributify, defineConfig } from "unocss";
import { presetScrollbar } from "unocss-preset-scrollbar";
export default defineConfig({
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
});
