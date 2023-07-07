import { kv } from "@vercel/kv";
import Pusher from "pusher";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";

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
	const playerid = getQuery(event).playerid as string;
	if (!playerid) {
		return 401;
	}

	const game: Game | null = await kv.get(`game-${getQuery(event).id}`);

	if (!game) {
		return 404;
	}
	game.players = game.players.filter((player) => player.id !== playerid);

	// await kv.publish(gameid, JSON.stringify({ key: Key.game, id: "players", value: game.players }));
	await kv.set("game-" + gameid, JSON.stringify(game));
	await pusher.trigger(gameid, "update", { key: Key.game, id: "players", value: game.players });
	return true;
});
