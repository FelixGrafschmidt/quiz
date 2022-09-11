import { Song } from "~~/models/interfaces/Song";

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const songs = (await useStorage().getItem(`redis:songs-${url.searchParams.get("number")}`)) as Array<Song>;
	await useStorage().setItem("redis:songs", songs);
	return songs;
});
