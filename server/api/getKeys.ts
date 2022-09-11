export default defineEventHandler(async () => {
	const keys = ((await useStorage().getKeys()) as Array<string>).filter((key: string) => key.startsWith("redis:songs-"));
	return keys;
});
