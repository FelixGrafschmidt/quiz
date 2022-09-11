import { Session } from "~~/models/interfaces/Session";
import { Song } from "~~/models/interfaces/Song";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const body = (await useBody(event)) as Array<Song>;
	await useStorage().setItem(`redis:songs-` + session.activeSet, body);
	return true;
});
