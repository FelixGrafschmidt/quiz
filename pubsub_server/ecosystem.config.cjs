module.exports = {
	apps: [
		{
			name: "pubsub server",
			exec_mode: "cluster",
			instances: "max",
			script: "yarn",
			args: "start",
		},
	],
};
