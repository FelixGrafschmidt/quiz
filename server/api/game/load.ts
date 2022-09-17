import { createClient } from "redis";
import { Game } from "~~/models/interfaces/Game";

const client = createClient({ url: "redis://127.0.0.1:6379", database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);

	const result: Game = JSON.parse((await client.get(`game-${url.searchParams.get("id")}`)) || "{}");

	return result;
});
