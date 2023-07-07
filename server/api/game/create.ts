import { nanoid } from "nanoid";
import { kv } from "@vercel/kv";
import { Game } from "models/interfaces/Game";

export default defineEventHandler(async () => {
	const id = nanoid();
	const game: Game = {
		id,
		players: [],
		sets: [],
		activeSet: null,
	};
	await kv.set(`game-${id}`, JSON.stringify(game));
	return game;
});
