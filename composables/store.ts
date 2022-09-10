import { defineStore } from "pinia";
import { Player } from "~~/models/interfaces/Player";
import { Song } from "~~/models/interfaces/Song";

export const useStore = defineStore("store", {
	state: () => ({
		players: [] as Player[],
		songs: [] as Song[],
		setCount: 0,
	}),
	actions: {
		async unloadSet() {
			await $fetch("/api/unloadSet");
			this.songs = [];
		},
		async loadSongs() {
			this.songs = await $fetch<Song[]>("/api/loadSongs");
		},
		async saveSongs() {
			await $fetch("/api/saveSongs", { body: this.songs, method: "POST" });
		},
		async activateSet(number: number) {
			this.songs = await $fetch(`/api/activateSet?number=${number}`);
		},
		async addSet(set: Song[]) {
			await $fetch("/api/addSet", { body: set, method: "POST" });
			await this.getSetCount();
		},
		async getSetCount() {
			this.setCount = (await $fetch("/api/getKeys")).length || 0;
		},
		async savePlayer(player: Player) {
			// this.players.push(player);
			await $fetch("/api/savePlayer", { body: player, method: "POST" });
		},
		async loadPlayers() {
			try {
				this.players = await $fetch("/api/loadPlayers");
			} catch (error) {
				console.error(error);
			}
		},
		async removePlayers() {
			await $fetch("/api/removePlayers");
			this.players = [];
		},
	},
});
