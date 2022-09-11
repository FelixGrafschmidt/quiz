export interface Session {
	id: string;
	players: Array<string>;
	sets: Array<string>;
	activeSet: string;
}
