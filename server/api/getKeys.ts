export default defineEventHandler(async () => {
	const keys = (await useStorage().getKeys()).filter((key) => key.startsWith("redis:songs-"));
	return keys;
});
