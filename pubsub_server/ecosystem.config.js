module.exports = {
	apps: [
		{
			name: "pubsub server",
			cwd: "./pubsub_server",
			exec_mode: "cluster",
			instances: "max",
			script: "yarn",
			args: "start",
		},
	],
};
