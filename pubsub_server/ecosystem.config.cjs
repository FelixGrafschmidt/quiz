module.exports = {
	apps: [
		{
			name: "pubsub_server",
			exec_mode: "cluster",
			instances: "max",
			script: "yarn",
			args: "start",
		},
	],
};
