import { createClient } from "redis";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Player } from "~~/models/interfaces/Player";

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

	const player = (await useBody(event)) as Player;
	if (!game.players.find((p) => p.id === player.id)) {
		game.players.push(player);
	}
	await client.publish(gameid, JSON.stringify({ key: Key.game, id: "players", value: game.players }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});
