import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";
import * as dotenv from "dotenv";
import { CronJob } from "cron";
dotenv.config();

// Configuration: adapt to your environment
const REDIS_SERVER = "redis://localhost:" + process.env.REDIS_PORT;
const WEB_SOCKET_PORT = 4000;

const channels = [] as string[];

// Connect to Redis and subscribe to "app:notifications" channel
const client = createClient({ url: REDIS_SERVER });
await client.connect();
await client.select(1);

const server = new WebSocketServer({ port: WEB_SOCKET_PORT });

let sockets: Array<{ id: string; socket: WebSocket }> = [];

// broadcast on web socket when receving a Redis PUB/SUB Event
await client.subscribe("register-channel", (message) => {
	console.log("register-channel", message);
	if (!channels.includes(message)) {
		client.subscribe(message, (message, channel) => {
			sockets.forEach((s) => {
				if (s.id === channel) {
					s.socket.send(message);
				}
			});
		});
		channels.push(message);
	}
});

// Register event for client connection
server.on("connection", function connection(ws, req) {
	if (!req.url) return;
	const url = new URL(req.url, `http://${req.headers.host}`);
	const channel = url.searchParams.get("channel");
	if (channel) {
		sockets.push({ id: channel, socket: ws });
	}
});

console.log("WebSocket server started at ws://localhost:" + WEB_SOCKET_PORT);

new CronJob("0 0 * * *", () => {
	sockets = [];
}).start();
