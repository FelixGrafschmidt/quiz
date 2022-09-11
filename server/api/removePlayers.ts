export default defineEventHandler(async () => {
	const keys = ((await useStorage().getKeys()) as Array<string>).filter((key: string) => key.startsWith("redis:player-"));
	keys.forEach(async (key: string) => {
		await useStorage().removeItem(key);
	});
	return true;
});
