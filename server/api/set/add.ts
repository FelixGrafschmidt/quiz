import { kv } from "@vercel/kv";
import Pusher from "pusher";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";
import { removeDuplicates } from "~~/utils/arrays";

const pusher = new Pusher({
	appId: process.env.PUSHER_APPID || "",
	key: "4956cd21dbf523a6c3d4",
	secret: process.env.PUSHER_SECRET || "",
	cluster: "eu",
	useTLS: true,
});

export default defineEventHandler(async (event) => {
	if (!getRequestPath(event)) {
		return 401;
	}
	const gameid = getQuery(event).id as string;
	if (!gameid) {
		return 401;
	}
	const set: Set = await readBody(event);

	const game: Game | null = await kv.get(`game-${getQuery(event).id}`);

	if (!game) {
		return 404;
	}
	if (game.sets.find((s) => set.id === s.id)) {
		game.sets = game.sets.filter((s) => s.id !== set.id);
	}

	game.sets.push(set);

	game.sets = removeDuplicates(game.sets, "id");

	// await kv.publish(gameid, JSON.stringify({ key: Key.set, id: set.id, value: set }));
	await kv.set("game-" + gameid, JSON.stringify(game));
	await pusher.trigger(gameid, "update", { key: Key.set, id: set.id, value: set });
	return true;
});
