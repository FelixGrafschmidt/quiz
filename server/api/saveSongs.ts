export default defineEventHandler(async (event) => {
	const body = await useBody(event);
	await useStorage().setItem(`redis:songs`, body);
});
