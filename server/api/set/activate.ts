import { createClient } from "redis";
import shuffleSeeded from "knuth-shuffle-seeded";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";

const port = parseInt(process.env.REDIS_PORT || "6378");
const client = createClient({ url: `redis://127.0.0.1:${port}`, database: 1 });
client.connect();

export default defineEventHandler(async (event) => {
	const alphabet = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
	];
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
	// set.songs.forEach((song, i) => {
	// 	song.answer = alphabet[i];
	// });
	game.activeSet = set;
	const options = [];
	for (const song of game.activeSet.songs) {
		const answer = song.id + "|" + song.tags.join(" ~ ");
		options.push(answer);
		song.answer = answer;
	}
	shuffleSeeded(options);
	game.activeSet.options = {};
	options.forEach((option, i) => {
		(game.activeSet as Set).options[option] = alphabet[i];
	});
	// const seed = set.songs.reduce((prev, curr) => {
	// 	prev += curr.name.length;
	// 	return prev;
	// }, 0);
	game.activeSet.songs = shuffleSeeded(JSON.parse(JSON.stringify(set.songs)));

	await client.publish(gameid, JSON.stringify({ key: Key.game, id: "activeSet", value: set }));
	await client.set("game-" + gameid, JSON.stringify(game));
	return true;
});

// function shuffle(set: Set) {
// 	const copy = JSON.parse(JSON.stringify(set)) as Set;
// 	let seed = set.songs.reduce((prev, curr) => {
// 		prev += curr.name.length;
// 		return prev;
// 	}, 0);
// 	while (seed > 1) {
// 		seed /= 10;
// 	}
// 	for (let i = copy.songs.length - 1; i > 0; i--) {
// 		const j = Math.floor(seed * (i + 1));
// 		const temp = copy.songs[i];
// 		copy.songs[i] = copy.songs[j];
// 		copy.songs[j] = temp;
// 	}
// 	return copy;
// }
// const copy = JSON.parse(JSON.stringify(set)) as Set;
// let seed = set.songs.reduce((prev, curr) => {
// 	prev += curr.name.length;
// 	return prev;
// }, 0);

// console.log(seed);

// let m = copy.songs.length;
// let t: Song;
// let i: number;

// // While there remain elements to shuffle…
// while (m) {
// 	// Pick a remaining element…
// 	i = Math.floor(random(seed) * m--);

// 	// And swap it with the current element.
// 	t = copy.songs[m];
// 	copy.songs[m] = copy.songs[i];
// 	copy.songs[i] = t;
// 	++seed;
// }
// return copy;

// function random(seed: number) {
// 	const x = Math.sin(seed++) * 10000;
// 	return x - Math.floor(x);
// }
