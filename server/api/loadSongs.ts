import { createClient } from "redis";
import { Song } from "~~/models/interfaces/Song";

const client = createClient({ url: "redis://127.0.0.1:6379" });
client.connect();

// export default async () => {
// 	const response = await client.get("songs-1");
// 	return (JSON.parse(response) || []) as Song[];
// };

export default defineEventHandler(async () => {
	const response = await useStorage().getItem("redis:songs");
	return (JSON.parse(response) || []) as Song[];
});
