import { createClient } from "redis";

const client = createClient({ url: "redis://127.0.0.1:6379" });
client.connect();

// export default async () => {
// 	const response = await client.get("songs-1");
// 	return (JSON.parse(response) || []) as Song[];
// };

export default defineEventHandler(async (event) => {
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const songs = await useStorage().getItem(`redis:songs-${url.searchParams.get("number")}`);
	useStorage().setItem("redis:songs", songs);
	// return (JSON.parse(response) || []) as Song[];
});
