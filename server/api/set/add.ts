import { createClient } from "redis";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";
import { removeDuplicates } from "~~/utils/arrays";

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
	if (game.sets.find((s) => set.id === s.id)) {
		game.sets = game.sets.filter((s) => s.id !== set.id);
	}

	game.sets.push(set);

	game.sets = removeDuplicates(game.sets, "id");

	await client.publish(gameid, JSON.stringify({ key: Key.set, id: set.id, value: set }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});
