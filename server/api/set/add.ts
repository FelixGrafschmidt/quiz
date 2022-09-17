import { createClient } from "redis";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";

const client = createClient({ url: "redis://127.0.0.1:6379", database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return 401;
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const gameid = url.searchParams.get("id");
	if (!gameid) {
		return 401;
	}
	const set: Set = await useBody(event);

	const game: Game = JSON.parse((await client.get("game-" + gameid)) || "{}");

	game.sets.push(set);

	await client.publish(gameid, JSON.stringify({ key: "set", id: set.id, value: set }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});
