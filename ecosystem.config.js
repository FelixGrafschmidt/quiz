module.exports = {
	apps: [
		{
			name: "quiz",
			exec_mode: "cluster",
			instances: "max",
			script: "./.output/server/index.mjs",
			args: "--PORT=3001",
		},
	],
};
