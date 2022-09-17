import { Session } from "~~/models/interfaces/Game";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	session.activeSet = "";
	await useStorage().setItem(`redis:session-${sessionid}`, session);
	return true;
});
