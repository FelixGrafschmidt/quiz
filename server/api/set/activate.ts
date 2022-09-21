import { createClient } from "redis";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";
import { Song } from "~~/models/interfaces/Song";

const client = createClient({ url: "redis://127.0.0.1:6379", database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const gameid = url.searchParams.get("id");
	if (!gameid) {
		return 401;
	}

	const game: Game = JSON.parse((await client.get(`game-${gameid}`)) || "{}");
	const setid = url.searchParams.get("setid") || "";

	const set = game.sets.find((set) => set.id === setid);

	if (!set) {
		return 404;
	}
	game.activeSet = shuffle(set);
	game.activeSetOrig = set;

	await client.publish(gameid, JSON.stringify({ key: Key.game, id: "activeSet", value: set }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});

function shuffle(set: Set) {
	const copy = JSON.parse(JSON.stringify(set)) as Set;
	let seed = set.songs.reduce((prev, curr) => {
		prev += curr.name.length;
		return prev;
	}, 0);

	let m = copy.songs.length;
	let t: Song;
	let i: number;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(random(seed) * m--);

		// And swap it with the current element.
		t = copy.songs[m];
		copy.songs[m] = copy.songs[i];
		copy.songs[i] = t;
		++seed;
	}
	return copy;
}

function random(seed: number) {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}
