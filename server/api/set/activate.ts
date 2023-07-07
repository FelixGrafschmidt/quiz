import { kv } from "@vercel/kv";
import shuffleSeeded from "knuth-shuffle-seeded";
import Pusher from "pusher";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";

const pusher = new Pusher({
	appId: process.env.PUSHER_APPID || "",
	key: "4956cd21dbf523a6c3d4",
	secret: process.env.PUSHER_SECRET || "",
	cluster: "eu",
	useTLS: true,
});
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
	if (!getRequestPath(event)) {
		return 401;
	}
	const gameid = getQuery(event).id as string;
	if (!gameid) {
		return 401;
	}
	const game: Game | null = await kv.get(`game-${getQuery(event).id}`);

	if (!game) {
		return 404;
	}

	const setid = getQuery(event).setid as string;
	const set = game.sets.find((set) => set.id === setid);

	if (!set) {
		return 404;
	}
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
	game.activeSet.songs = shuffleSeeded(JSON.parse(JSON.stringify(set.songs)));

	await kv.set("game-" + gameid, JSON.stringify(game));
	await pusher.trigger(gameid, "update", { key: Key.game, id: "activeSet", value: set });
	return true;
});
