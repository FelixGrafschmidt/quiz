export interface Player {
	name: string;
	points: number;
	id: string;
	guesses: Record<string, string>;
}
