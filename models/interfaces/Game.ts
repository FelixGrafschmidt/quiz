import { Player } from "./Player";
import { Set } from "./Set";

export interface Game {
	id: string;
	players: Player[];
	sets: Set[];
	activeSet: Set | null;
	// activeSetOrig: Set | null;
}
