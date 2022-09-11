import { nanoid } from "nanoid";
import { Session } from "~~/models/interfaces/Session";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return -1;
	}
	const sessionid = new URL(event.req.url, `http://${event.req.headers.host}`).searchParams.get("id");
	const body = await useBody(event);
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const setid = nanoid();
	await useStorage().setItem(`redis:songs-${setid}`, body);
	session.sets.push(setid);
	await useStorage().setItem("redis:session-" + sessionid, session);
	return true;
});
