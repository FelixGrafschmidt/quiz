import { createClient } from "redis";

const port = parseInt(process.env.REDIS_PORT || "6378");
const client = createClient({ url: `redis://127.0.0.1:${port}`, database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const id = url.searchParams.get("id");
	if (!id) {
		return 401;
	} else {
		await client.publish("register-channel", id);
		return 204;
	}
});
