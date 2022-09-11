import { Session } from "~~/models/interfaces/Session";
import { Song } from "~~/models/interfaces/Song";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const response = (await useStorage().getItem("redis:songs-" + session.activeSet)) as Array<Song>;
	return response;
});
