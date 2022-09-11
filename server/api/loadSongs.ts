import { Song } from "~~/models/interfaces/Song";

export default defineEventHandler(async () => {
	const response = (await useStorage().getItem("redis:songs")) as Array<Song>;
	return response;
});
