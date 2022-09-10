export default defineEventHandler(async () => {
	const keys = (await useStorage().getKeys()).filter((key) => key.startsWith("redis:player-"));
	keys.forEach(async (key) => {
		await useStorage().removeItem(key);
	});
	return true;
});
