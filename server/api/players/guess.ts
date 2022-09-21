import { createClient } from "redis";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";

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
	const playerid = url.searchParams.get("playerid");
	if (!playerid) {
		return 401;
	}
	const songid = url.searchParams.get("songid");
	if (!songid) {
		return 401;
	}
	const guess = url.searchParams.get("guess");
	if (!guess) {
		return 401;
	}

	const game: Game = JSON.parse((await client.get("game-" + gameid)) || "{}");

	game.players.forEach((player) => {
		if (player.id === playerid) {
			player.guesses[songid] = guess;
		}
	});

	await client.publish(gameid, JSON.stringify({ key: Key.player, id: "guess", value: { playerid, songid, guess } }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});
