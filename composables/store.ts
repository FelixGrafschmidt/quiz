import { youtube_v3 as ytV3 } from "@googleapis/youtube";
import { GaxiosResponse } from "gaxios";

import { defineStore } from "pinia";
import { Player } from "~~/models/interfaces/Player";
import { Session } from "~~/models/interfaces/Session";
import { Song } from "~~/models/interfaces/Song";

export const useStore = defineStore("store", {
	state: () => ({
		session: {} as Session,
		songs: [] as Song[],
		players: [] as Player[],
		searchResult: {} as GaxiosResponse<ytV3.Schema$SearchListResponse>,
	}),
	actions: {
		// Session
		async createSession() {
			return await $fetch("/api/session/create");
		},
		async loadSession(id: string | undefined = undefined) {
			this.session = await $fetch("/api/session/load?id=" + (id || this.session.id));
		},
		// Set
		async addSet(set: Song[]) {
			await $fetch("/api/set/add?id=" + this.session.id, { body: set, method: "POST" });
		},
		async activateSet(setid: string) {
			this.songs = await $fetch(`/api/set/activate?setid=${setid}&id=${this.session.id}`);
		},
		async deactivateSet() {
			await $fetch("/api/set/deactivate?id=" + this.session.id);
		},
		async cleanSet() {
			await $fetch("/api/set/clean?id=" + this.session.id);
		},
		// Songs
		async saveSongs() {
			await $fetch("/api/songs/save?id=" + this.session.id, { body: this.songs, method: "POST" });
		},
		async loadSongs() {
			this.songs = await $fetch<Song[]>("/api/songs/load?id=" + this.session.id);
		},
		// Players
		async savePlayer(player: Player) {
			await $fetch("/api/players/save?id=" + this.session.id, { body: player, method: "POST" });
		},
		async loadPlayers() {
			this.players = await $fetch("/api/players/load?id=" + this.session.id);
		},
		async removePlayers() {
			await $fetch("/api/players/remove?id=" + this.session.id);
		},
		async search(query: string) {
			this.searchResult = (await $fetch("/api/youtube/search", {
				params: { query },
				headers: { Referer: window.location.href },
			})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
		},
	},
});
