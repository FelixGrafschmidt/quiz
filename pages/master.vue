<template>
	<div xl="w-5xl mx-auto">
		<section w-full bg-gray-600 flex items-center flex-row justify-around divide-x>
			<button w="1/2" h-16 flex items-center justify-center @click="mode = 'prep'">Preparation</button>
			<button w="1/2" h-16 flex items-center justify-center @click="mode = 'game'">Game</button>
		</section>
		<section v-if="mode === 'prep'" divide-y flex flex-col>
			<div py-4 px-2>
				<span text-xl mb-2>Connected Players</span>
				<span v-for="(player, i) in players" :key="i">
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
						<button v-for="(set, i) in store.game.sets" :key="i" h-12 rounded bg-gray-600 w="45%" @click="activateSet()">
							Start Set {{ set.name }}
						</button>
					</div>
				</div>
			</div>
			<div py-4 px-2 flex="~ row wrap" justify-center w-full gap-4>
				<!-- <button w="33%" h-12 rounded bg-red-800 @click="store.deactivateSet()">Unload Songs</button>
				<button w="33%" h-12 rounded bg-red-800 @click="store.removePlayers()">Remove Players</button>
				<button w="33%" h-12 rounded bg-red-800 @click="store.cleanSet()">Clean Set</button> -->
			</div>
		</section>
		<section v-else-if="mode === 'game'" mx-auto my-auto justify-center items-center mt-4 flex="~ col" gap-8>
			<div
				v-for="(song, i) in songs"
				:key="i"
				items-center
				justify-center
				w-screen
				max-w="16rem"
				border-8
				rounded
				flex="~ col"
				bg-gray-700
			>
				<div flex flex-col items-center py-4 gap-2>
					<div text-3rem>
						{{ (songs.indexOf(song) + 1).toString().padStart(2, "0") }}
					</div>
					<div flex flex-col w-full items-center>
						<div text-xl font-extrabold>{{ song.origin }}</div>
						<div italic text-sm>{{ song.name }}</div>
					</div>
				</div>
				<div py-4 flex flex-row flex-wrap gap-3 border-y-2 w-full px-4>
					<span v-for="(tag, k) in song.tags" :key="k">{{ tag }}</span>
				</div>
				<div v-if="!song.revealed" flex flex-row flex-wrap border-y-2 w-full bg-teal-700 items-center justify-center>
					<button h-full w-full p-4 @click="revealSong(song)">Reveal?</button>
				</div>
				<div v-else p-4>Revealed</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ComputedRef } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Song } from "~~/models/interfaces/Song";

	definePageMeta({
		middleware: ["game"],
	});

	const store = useStore();
	const songs: ComputedRef<Song[]> = computed(() => []);
	const players: ComputedRef<Player[]> = computed(() => store.game.players);
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

	function revealSong(song: Song) {
		song.revealed = true;
		// await store.saveSongs();
	}

	async function activateSet() {
		// await store.activateSet(set);
		// await store.loadSession();
		// await store.loadSongs();
		// mode.value = "game";
	}

	// await store.loadSongs();
	// await store.loadPlayers();

	// const interval = setInterval(async () => {
	// 	await store.loadSession();
	// 	await store.loadSongs();
	// 	await store.loadPlayers();
	// }, 1000);

	// onBeforeUnmount(() => {
	// 	clearInterval(interval);
	// });
</script>
