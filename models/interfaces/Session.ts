import { Player } from "./Player";
import { Song } from "./Song";

export interface Session {
	id: string;
	players: Array<Player>;
	sets: Array<Record<string, Array<Song>>>;
}
