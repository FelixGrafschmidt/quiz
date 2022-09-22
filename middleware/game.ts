export default defineNuxtRouteMiddleware(async (to) => {
	const store = useStore();
	const gameid = to.query.game;

	if (gameid) {
		await store.loadGame(gameid.toString());
		if (!store.game || !store.game.id) {
			showError({ statusCode: 401, statusMessage: "Invalid Request" });
		} else {
			store.registerChannel(gameid.toString());
		}
	} else {
		showError({ statusCode: 401, statusMessage: "Invalid Request" });
	}
});
