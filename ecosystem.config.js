module.exports = {
	apps: [
		{
			name: "quiz",
			exec_mode: "cluster",
			instances: 1,
			script: "./.output/server/index.mjs",
			env: {
				PORT: 3001,
				REDIS_PORT: 6378,
			},
		},
	],
};
