import { Song } from "./Song";

export interface Set {
	id: string;
	name: string;
	songs: Song[];
	options: Record<string, string>;
}
