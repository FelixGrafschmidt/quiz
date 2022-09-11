import { Session } from "~~/models/interfaces/Session";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	session.players.forEach(async (key: string) => {
		await useStorage().removeItem("redis:player-" + key);
	});
	session.players = [];
	await useStorage().setItem(`redis:session-${sessionid}`, session);
	return true;
});