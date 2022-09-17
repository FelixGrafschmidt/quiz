import { youtube_v3 as ytV3 } from "@googleapis/youtube";
import { GaxiosResponse } from "gaxios";

import { defineStore } from "pinia";
import { Game } from "~~/models/interfaces/Game";
import { Set } from "~~/models/interfaces/Set";

export const useStore = defineStore("store", {
	state: () => ({
		game: {} as Game,
		searchResult: {} as GaxiosResponse<ytV3.Schema$SearchListResponse>,
	}),
	actions: {
		// Channels
		async registerChannel(id: string) {
			await $fetch("/api/channel/register?id=" + id);
		},
		update(key: string, id: string, value: object) {
			switch (key) {
				case "set":
					const set = this.game.sets.find((set) => set.id === id);
					this.game.sets.filter((s) => s !== set);
					this.game.sets.push(value as Set);
					// this.game.sets.push(set)
					// const sets = this.game.sets as { [key: string]: Set };
					// sets[id] = value as Set;
					// Object.assign(this.game.sets, sets);
					break;
				case "song":
					break;
				case "player":
					break;

				default:
					break;
			}
		},
		// Session
		async createGame() {
			return await $fetch("/api/game/create");
		},
		async loadGame(id: string | undefined = undefined) {
			this.game = await $fetch("/api/game/load?id=" + (id || this.game.id));
		},
		// // Set
		async addSet(set: Set) {
			await $fetch("/api/set/add?id=" + this.game.id, { body: set, method: "POST" });
		},
		// async activateSet(setid: string) {
		// 	this.songs = await $fetch(`/api/set/activate?setid=${setid}&id=${this.session.id}`);
		// },
		// async deactivateSet() {
		// 	await $fetch("/api/set/deactivate?id=" + this.session.id);
		// },
		// async cleanSet() {
		// 	await $fetch("/api/set/clean?id=" + this.session.id);
		// },
		// // Songs
		// async saveSongs() {
		// 	await $fetch("/api/songs/save?id=" + this.session.id, { body: this.songs, method: "POST" });
		// },
		// async loadSongs() {
		// 	this.songs = await $fetch<Song[]>("/api/songs/load?id=" + this.session.id);
		// },
		// // Players
		// async savePlayer(player: Player) {
		// 	await $fetch("/api/players/save?id=" + this.session.id, { body: player, method: "POST" });
		// },
		// async loadPlayers() {
		// 	this.players = await $fetch("/api/players/load?id=" + this.session.id);
		// },
		// async removePlayers() {
		// 	await $fetch("/api/players/remove?id=" + this.session.id);
		// },
		// async search(query: string) {
		// 	this.searchResult = (await $fetch("/api/youtube/search", {
		// 		params: { query },
		// 		headers: { Referer: window.location.href },
		// 	})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
		// },
	},
});
