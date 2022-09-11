import { Player } from "~~/models/interfaces/Player";
import { Session } from "~~/models/interfaces/Session";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const players: Array<Player> = [];

	for (const key of session.players) {
		const entry = await useStorage().getItem("redis:player-" + key);
		players.push(entry);
	}

	return players;
});
