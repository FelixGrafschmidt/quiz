export default defineNuxtRouteMiddleware(async (to) => {
	const store = useStore();
	const gameid = to.query.game;

	if (gameid) {
		await store.loadGame(gameid.toString());
		if (!store.game || !store.game.id) {
			const id = (await store.createGame()).id;
			store.registerChannel(id);
			const target = { path: "/", query: { game: id } };
			return navigateTo(target);
		} else {
			store.registerChannel(gameid.toString());
		}
	} else {
		const id = (await store.createGame()).id;
		store.registerChannel(id);
		const target = { path: "/", query: { game: id } };
		return navigateTo(target);
	}
});
