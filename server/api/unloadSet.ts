export default defineEventHandler(async () => {
	await useStorage().setItem("redis:songs", []);
});
