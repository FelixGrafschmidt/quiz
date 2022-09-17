import { createClient } from "redis";
import { Session } from "~~/models/interfaces/Game";

const client = createClient({ url: "redis://127.0.0.1:6379", database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const sessionid = url.searchParams.get("id");
	const session = (await useStorage().getItem("redis:session-" + sessionid)) as Session;
	const setid = url.searchParams.get("setid") || "";
	session.activeSet = setid;
	await client.set(`session-${sessionid}`, JSON.stringify(session));
	await client.publish(`quiz-${sessionid}`, "update");
	// await useStorage().setItem(`redis:session-${sessionid}`, session);
	return true;
});
