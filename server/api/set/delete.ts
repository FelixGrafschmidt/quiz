import { createClient } from "redis";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";
import { removeDuplicates } from "~~/utils/arrays";

const port = parseInt(process.env.REDIS_PORT || "6378");
const client = createClient({ url: `redis://127.0.0.1:${port}`, database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	if (!event.node.req.url) {
		return 401;
	}
	const url = new URL(event.node.req.url, `http://${event.node.req.headers.host}`);
	const gameid = url.searchParams.get("id");
	if (!gameid) {
		return 401;
	}
	const set: Set = await readBody(event);

	const game: Game = JSON.parse((await client.get("game-" + gameid)) || "{}");

	game.sets = game.sets.filter((s) => s.id !== set.id);

	game.sets = removeDuplicates(game.sets, "id");

	await client.publish(gameid, JSON.stringify({ key: Key.set, id: set.id, value: undefined }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});
