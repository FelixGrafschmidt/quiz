import { nanoid } from "nanoid";
import { Player } from "~~/models/interfaces/Player";
import { Session } from "~~/models/interfaces/Session";
import { Song } from "~~/models/interfaces/Song";

export default defineEventHandler(async () => {
	const id = nanoid();
	const session: Session = {
		id,
		players: [] as Array<Player>,
		sets: [] as Array<Record<string, Array<Song>>>,
	};
	await useStorage().setItem(`redis:session-${id}`, session);
	return session;
});
