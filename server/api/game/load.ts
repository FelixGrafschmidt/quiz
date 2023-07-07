import { kv } from "@vercel/kv";
import { Game } from "~~/models/interfaces/Game";

export default defineEventHandler(async (event) => {
	if (!getRequestURL(event)) {
		return [];
	}

	const result: Game | null = await kv.get(`game-${getQuery(event).id}`);

	if (!result) {
		return 404;
	}

	return result;
});
