import { kv } from "@vercel/kv";
import Pusher from "pusher";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Player } from "~~/models/interfaces/Player";

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
	const game: Game | null = await kv.get(`game-${getQuery(event).id}`);

	if (!game) {
		return 404;
	}
	const player = (await readBody(event)) as Player;
	if (!game.players.find((p) => p.id === player.id)) {
		game.players.push(player);
	}
	await kv.set("game-" + gameid, JSON.stringify(game));
	await pusher.trigger(gameid, "update", { key: Key.game, id: "players", value: game.players });
	// await client.publish(gameid, JSON.stringify({ key: Key.game, id: "players", value: game.players }));

	return true;
});
