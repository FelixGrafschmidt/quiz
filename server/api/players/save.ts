import { Session } from "~~/models/interfaces/Session";
import { Player } from "~~/models/interfaces/Player";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const body = (await useBody(event)) as Player;
	if (!session.players.includes(body.id)) {
		session.players.push(body.id);
	}
	await useStorage().setItem(`redis:player-${body.id}`, body);
	await useStorage().setItem(`redis:session-${sessionid}`, session);
	return true;
});
