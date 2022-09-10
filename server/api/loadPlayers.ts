export default defineEventHandler(async () => {
	const players = [];
	const keys = (await useStorage().getKeys()).filter((key) => key.startsWith("redis:player-"));

	for (const key of keys) {
		const entry = await useStorage().getItem(key);
		players.push(entry);
	}

	return players;
});
