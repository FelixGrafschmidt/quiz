export default defineEventHandler(async () => {
	const response = await useStorage().getItem("redis:songs");
	return response;
});
