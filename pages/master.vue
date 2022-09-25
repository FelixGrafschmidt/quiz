<template>
	<div xl="w-5xl mx-auto">
		<section w-full bg-gray-600 flex items-center flex-row justify-around divide-x>
			<button w="1/2" h-16 flex items-center justify-center @click="mode = 'prep'">Preparation</button>
			<button w="1/2" h-16 flex items-center justify-center @click="mode = 'game'">Game</button>
		</section>
		<section v-if="mode === 'prep'" divide-y flex flex-col>
			<div py-4 px-2 flex="~ col">
				<span text-xl mb-2>Connected Players</span>
				<span
					v-for="(player, i) in players"
					:key="i"
					cursor-pointer
					w-fit
					hover="text-red-600 line-through"
					@click="store.removePlayer(player.id)"
				>
					{{ player.name }}
				</span>
			</div>
			<div py-4 px-2 flex="~ col" items-start justify-center>
				<div mb-2 flex="~ row" items-end gap-2>
					<span text-xl>Sets</span>
					<client-only>
						<a target="_blank" :href="editLink" underline cursor-pointer>Edit ></a>
					</client-only>
				</div>
				<div v-if="Object.keys(store.game.sets).length" flex="~ col wrap" py-4 gap-4 items-start justify-center w-full>
					<span>Available Sets</span>
					<div flex="~ row wrap" gap-4 items-start justify-center w-full>
						<button
							v-for="(s, i) in store.game.sets"
							:key="i"
							:class="{ 'border-teal border-2': store.game.activeSet?.id === s.id }"
							h-12
							rounded
							bg-gray-600
							w="45%"
							@click="activateSet(s)"
						>
							Start Set {{ s.name }}
						</button>
					</div>
				</div>
			</div>
			<div py-4 px-2 flex="~ row wrap" justify-center w-full gap-4>
				<button w="45%" px-4 h-16 rounded bg-gray-600 @click="copyInvite()">Copy Invite Link</button>
				<a
					:href="dashboardURL"
					cursor-pointer
					target="_blank"
					w="45%"
					px-4
					flex="~ row"
					items-center
					justify-center
					h-16
					rounded
					bg-gray-600
					>Open Overview</a
				>
				<button w="45%" px-4 h-16 rounded bg-red-800 @click="deactivateSet()">Deactivate Set</button>
				<button w="45%" px-4 h-16 rounded bg-red-800 @click="removePlayers()">Remove Players</button>
			</div>
		</section>
		<section v-else-if="mode === 'game' && set" mx-auto my-auto justify-center items-center mt-4 flex="~ col" gap-8>
			<div v-for="(song, i) in set.songs" :key="i" items-center justify-center w="16rem" border-8 rounded flex="~ col" bg-gray-700>
				<div flex="~ row grow" justify-around items-center w-full pb-4 min-h-40>
					<div w="60%" mx-2>
						<div text-3rem justify-center flex="~ row">
							{{ (set.songs.indexOf(song) + 1).toString().padStart(2, "0") }}
						</div>
						<div flex flex-col w-full items-center>
							<div text-xl font-extrabold text-center>
								<span>{{ song.origin }}</span>
							</div>
							<div italic text-sm text-center>{{ song.name }}</div>
						</div>
					</div>
					<div max-w="40%" flex="~ col" justify-center items-center h-full gap-4 w-full cursor-pointer>
						<div p-4 @click="song.playing && store.playing ? pause(song) : play(song)">
							<Icon h-8 w-8 :name="song.playing && store.playing ? 'fa:pause' : 'fa:play'" />
						</div>
						<div p-4 @click="song.playing ? stop() : undefined">
							<Icon :class="{ invisible: !song.playing }" h-8 w-8 name="fa:stop" />
						</div>
					</div>
				</div>
				<div py-4 flex flex-row flex-wrap gap-3 border-y-2 w-full px-4>
					<span v-for="(tag, k) in song.tags" :key="k">{{ tag }}</span>
				</div>
				<div v-if="!song.revealed" flex flex-row flex-wrap border-y-2 w-full bg-teal-700 items-center justify-center h-14>
					<button h-full w-full p-4 @click="revealSong(song)">Reveal?</button>
				</div>
				<div v-else h-14 p-4>Revealed</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ComputedRef } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Set } from "~~/models/interfaces/Set";
	import { Song } from "~~/models/interfaces/Song";

	definePageMeta({
		middleware: ["game"],
	});

	const store = useStore();
	const set: ComputedRef<Set | null> = computed(() => store.game.activeSet);
	const players: ComputedRef<Player[]> = computed(() => store.game.players);
	const dashboardURL: ComputedRef<string> = computed(() => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(useRoute().query)) {
			params.set(key, value?.toString() || "");
		}
		return "/?" + params;
	});
	const mode = ref(store.game.activeSet ? "game" : "prep");
	const editLink = computed(() => {
		if (process.server) {
			return "";
		} else {
			const url = new URL(window.location.href);
			url.pathname = "/edit";
			return url.toString();
		}
	});

	async function revealSong(song: Song) {
		await store.revealSong(song.id);
	}

	async function activateSet(set: Set) {
		await store.activateSet(set.id);
		mode.value = "game";
	}

	async function pause(song: Song) {
		await store.pauseSong(song.id);
	}

	async function play(song: Song) {
		await store.playSong(song.id);
	}
	async function stop() {
		await store.stopSong();
	}
	async function deactivateSet() {
		await store.deactivateSet();
	}
	async function removePlayers() {
		await store.removePlayers();
	}
	async function copyInvite() {
		const url = new URL(window.location.href);
		url.pathname = "player";
		await navigator.clipboard.writeText(url.toString());
	}
</script>
