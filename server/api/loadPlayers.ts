import { Player } from "~~/models/interfaces/Player";

export default defineEventHandler(async () => {
	const players: Array<Player> = [];
	const keys = ((await useStorage().getKeys()) as Array<string>).filter((key: string) => key.startsWith("redis:player-"));

	for (const key of keys) {
		const entry = await useStorage().getItem(key);
		players.push(entry);
	}

	return players;
});
