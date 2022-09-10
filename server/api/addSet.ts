export default defineEventHandler(async (event) => {
	const body = await useBody(event);
	const keys = (await useStorage().getKeys()).filter((key) => key.startsWith("redis:songs-")).length || 0;
	await useStorage().setItem(`redis:songs-${keys + 1}`, body);
	return keys + 1;
});
