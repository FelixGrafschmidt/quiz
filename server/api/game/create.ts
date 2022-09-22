import { nanoid } from "nanoid";
import { createClient } from "redis";
import { Game } from "~~/models/interfaces/Game";

const port = parseInt(process.env.REDIS_PORT || "6378");
const client = createClient({ url: `redis://127.0.0.1:${port}`, database: 1 });
client.connect();

export default defineEventHandler(async () => {
	const id = nanoid();
	const game: Game = {
		id,
		players: [],
		sets: [],
		activeSet: null,
		activeSetOrig: null,
	};
	await client.set(`game-${id}`, JSON.stringify(game));
	return game;
});
