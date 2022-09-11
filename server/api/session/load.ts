import { Session } from "~~/models/interfaces/Session";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	return (await useStorage().getItem(`redis:session-${url.searchParams.get("id")}`)) as Session;
});
