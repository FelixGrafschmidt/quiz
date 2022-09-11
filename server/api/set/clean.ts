import { Session } from "~~/models/interfaces/Session";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const availablePlayers = [];
	const availableSets = [];
	for (const player of session.players) {
		if (await useStorage().hasItem("redis:player-" + player)) {
			availablePlayers.push(player);
		}
	}
	session.players = availablePlayers;
	for (const set of session.sets) {
		if (await useStorage().hasItem("redis:songs-" + set)) {
			availableSets.push(set);
		}
	}
	session.sets = availableSets;
	if (!(await useStorage().hasItem("redis:songs-" + session.activeSet))) {
		session.activeSet = "";
	}
	await useStorage().setItem(`redis:session-${sessionid}`, session);
	return true;
});
