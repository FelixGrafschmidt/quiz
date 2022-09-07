module.exports = {
	root: true,
	parser: "vue-eslint-parser",
	parserOptions: {
		sourceType: "module",
	},
	env: {
		browser: true,
		amd: true,
		node: true,
	},
	extends: [
		"plugin:vue/vue3-recommended",
		"eslint:recommended",
		"@vue/eslint-config-typescript/recommended",
		"@vue/eslint-config-prettier",
	],
	plugins: ["typescript"],
	// add your custom rules here
	rules: {
		"no-console": "off",
		"no-debugger": "off",
		// "vue/first-attribute-linebreak": "off",
	},
};
