import { nanoid } from "nanoid";
import { Session } from "~~/models/interfaces/Session";

export default defineEventHandler(async () => {
	const id = nanoid();
	const session: Session = {
		id,
		players: [] as Array<string>,
		sets: [] as Array<string>,
		activeSet: "",
	};
	await useStorage().setItem(`redis:session-${id}`, session);
	return session;
});
