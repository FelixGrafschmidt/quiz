export default defineEventHandler(async (event) => {
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const songs = await useStorage().getItem(`redis:songs-${url.searchParams.get("number")}`);
	await useStorage().setItem("redis:songs", songs);
	return songs;
});
