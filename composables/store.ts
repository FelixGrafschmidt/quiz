import { youtube_v3 as ytV3 } from "@googleapis/youtube";
import { GaxiosResponse } from "gaxios";

import { defineStore } from "pinia";
import { Key } from "~~/models/enums/Update";
import { Game } from "~~/models/interfaces/Game";
import { Player } from "~~/models/interfaces/Player";
import { Set } from "~~/models/interfaces/Set";

export const useStore = defineStore("store", {
	state: () => ({
		game: {} as Game,
		playing: false,
		searchResult: {} as GaxiosResponse<ytV3.Schema$SearchListResponse>,
		nextPageToken: "" as ytV3.Schema$TokenPagination,
		previousPageToken: "" as ytV3.Schema$TokenPagination,
	}),
	actions: {
		// Channels
		async registerChannel(id: string) {
			await $fetch("/api/channel/register?id=" + id);
		},
		update(key: Key, id: string, value: unknown) {
			switch (key) {
				case Key.game:
					if (id === "activeSet") {
						this.game.activeSet = value as Set;
					} else if (id === "players") {
						this.game.players = value as Player[];
					}
					break;
				case Key.set:
					if (!value) {
						this.game.sets = this.game.sets.filter((s) => s.id !== id);
					} else {
						const set = this.game.sets.find((set) => set.id === id);
						if (set) {
							this.game.sets = this.game.sets.filter((s) => s.id !== set.id);
						}
						this.game.sets.push(value as Set);
					}
					break;
				case Key.song:
					if (!this.game.activeSet) {
						return;
					}
					if (id === "play") {
						this.game.activeSet.songs.forEach((song) => {
							song.playing = song.id === value;
						});
						this.playing = true;
					} else if (id === "pause") {
						this.playing = false;
					} else if (id === "stop") {
						this.game.activeSet.songs.forEach((song) => {
							song.playing = false;
						});
						this.playing = false;
					} else if (id === "reveal") {
						this.game.activeSet.songs.forEach((song) => {
							if (song.id === value) {
								song.revealed = true;
							}
						});
					}
					break;
				case Key.player:
					if (id === "guess") {
						const { playerid, songid, guess } = value as { playerid: string; songid: string; guess: string };
						this.game.players.forEach((player) => {
							if (player.id === playerid) {
								player.guesses[songid] = guess;
							}
						});
					}
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
		async deleteSet(set: Set) {
			await $fetch("/api/set/delete?id=" + this.game.id, { body: set, method: "POST" });
		},
		async activateSet(setid: string) {
			await $fetch(`/api/set/activate?setid=${setid}&id=${this.game.id}`);
		},
		async deactivateSet() {
			await $fetch("/api/set/deactivate?id=" + this.game.id);
		},
		// Songs
		async playSong(songid: string) {
			await $fetch(`/api/song/play?songid=${songid}&id=${this.game.id}`);
		},
		async pauseSong(songid: string) {
			await $fetch(`/api/song/pause?songid=${songid}&id=${this.game.id}`);
		},
		async stopSong() {
			await $fetch(`/api/song/stop?id=${this.game.id}`);
		},
		async revealSong(songid: string) {
			await $fetch(`/api/song/reveal?songid=${songid}&id=${this.game.id}`);
		},
		// // Players
		async guess(songid: string, playerid: string, guess: string) {
			await $fetch(`/api/players/guess?guess=${guess}&playerid=${playerid}&songid=${songid}&id=${this.game.id}`);
		},
		async add(player: Player) {
			await $fetch(`/api/players/add?id=${this.game.id}`, { body: player, method: "POST" });
		},
		async removePlayers() {
			await $fetch(`/api/players/removeAll?id=${this.game.id}`);
		},
		async removePlayer(playerid: string) {
			await $fetch(`/api/players/remove?id=${this.game.id}&playerid=${playerid}`);
		},
		async search(query: string) {
			this.searchResult = (await $fetch("/api/youtube/search", {
				params: { query },
				headers: { Referer: window.location.href },
			})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
			this.nextPageToken = this.searchResult.data.nextPageToken || "";
			this.previousPageToken = this.searchResult.data.prevPageToken || "";
		},
		async nextPage(query: string) {
			this.searchResult = (await $fetch("/api/youtube/search", {
				params: { query, pagetoken: this.nextPageToken },
				headers: { Referer: window.location.href },
			})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
			this.nextPageToken = this.searchResult.data.nextPageToken || "";
			this.previousPageToken = this.searchResult.data.prevPageToken || "";
		},
		async previousPage(query: string) {
			this.searchResult = (await $fetch("/api/youtube/search", {
				params: { query, pagetoken: this.previousPageToken },
				headers: { Referer: window.location.href },
			})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
			this.nextPageToken = this.searchResult.data.nextPageToken || "";
			this.previousPageToken = this.searchResult.data.prevPageToken || "";
		},
	},
});
