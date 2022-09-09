import { defineStore } from "pinia";
import { Song } from "~~/models/interfaces/Song";

export const useStore = defineStore("store", {
	state: () => ({
		players: [
			{
				name: "Julia",
				points: 0,
				id: 0,
			},
			{
				name: "Fabian",
				points: 0,
				id: 1,
			},
			{
				name: "Philipp",
				points: 0,
				id: 2,
			},
		],
		songs: [],
	}),
	actions: {
		async loadSongs() {
			this.songs = await $fetch<Song[]>("/api/loadSongs");
		},
		async saveSongs() {
			await $fetch("/api/saveSongs");
		},
		async activateSet(number: number) {
			await $fetch(`/api/activateSet?number=${number}`);
		},
		async addSet(set: Song[]) {
			await $fetch("/api/addSet", { body: set });
		},
	},
});
