import { createClient } from "redis";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";

const port = parseInt(process.env.REDIS_PORT || "6378");
const client = createClient({ url: `redis://127.0.0.1:${port}`, database: 1 });
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

	const game: Game = JSON.parse((await client.get("game-" + gameid)) || "{}");
	game.players = [];

	await client.publish(gameid, JSON.stringify({ key: Key.game, id: "players", value: [] }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});
