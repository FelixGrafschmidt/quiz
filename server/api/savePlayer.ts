export default defineEventHandler(async (event) => {
	const body = await useBody(event);
	await useStorage().setItem(`redis:player-${body.id}`, body);
	return true;
});
