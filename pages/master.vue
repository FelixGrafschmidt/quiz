<template>
	<div>
		<section class="w-full bg-gray-600 flex items-center flex-row justify-around divide-x">
			<button class="w-1/2 h-16 flex items-center justify-center" @click="mode = 'prep'">Preparation</button>
			<button class="w-1/2 h-16 flex items-center justify-center" @click="mode = 'game'">Game</button>
		</section>
		<section v-if="mode === 'prep'" class="divide-y flex flex-col">
			<div py-4 px-2>
				<span class="text-xl mb-2">Connected Players</span>
				<span v-for="(player, i) in players" :key="i">
					{{ player.name }}
				</span>
			</div>
			<div v-if="setCount > 0" py-4 class="flex flex-row flex-wrap gap-4 items-center justify-center">
				<button
					v-for="i in setCount"
					:key="i"
					class="h-12 w-45% rounded bg-gray-600"
					@click="
						store.activateSet(i);
						mode = 'game';
					"
				>
					Start Set {{ i }}
				</button>
			</div>
			<div py-4 px-2>
				<span class="text-xl">Create new Set</span>
				<textarea v-model="newSet" class="rounded my-2 text-black" cols="30" rows="10"></textarea>
				<button class="h-12 rounded bg-gray-600" @click="addSet">Save</button>
			</div>
			<div py-4 px-2 flex="~ row" justify-center w-full gap-4>
				<button class="h-12 w-50% rounded bg-red-800" @click="store.unloadSet()">Unload Songs</button>
				<button class="h-12 w-50% rounded bg-red-800" @click="store.removePlayers()">Remove Players</button>
			</div>
		</section>
		<section v-else-if="mode === 'game'" class="mx-auto my-auto justify-center items-center mt-4" flex="~ col" gap-8>
			<div v-for="(song, i) in songs" :key="i" class="items-center justify-center" border-8 rounded flex="~ col" bg-gray-700>
				<div class="flex flex-col items-center" py-4 gap-2>
					<div class="text-3rem">
						{{ (songs.indexOf(song) + 1).toString().padStart(2, "0") }}
					</div>
					<div class="flex flex-col w-full items-center">
						<div class="text-xl font-extrabold">{{ song.origin }}</div>
						<div class="italic text-sm">{{ song.name }}</div>
					</div>
				</div>
				<div class="py-4 flex flex-row flex-wrap gap-3 border-y-2 w-full px-4">
					<span v-for="(genre, k) in song.genres" :key="k">{{ genre }}</span>
				</div>
				<div v-if="!song.revealed" class="flex flex-row flex-wrap border-y-2 w-full bg-teal-700 items-center justify-center">
					<button class="h-full w-full p-4" @click="revealSong(song)">Reveal?</button>
				</div>
				<div v-else p-4>Revealed</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { nanoid } from "nanoid";
	import { ComputedRef } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Song } from "~~/models/interfaces/Song";

	const store = useStore();
	const songs: ComputedRef<Song[]> = computed(() => store.songs);
	const players: ComputedRef<Player[]> = computed(() => store.players);
	const mode = ref("prep");
	const newSet = ref("");
	await store.getSetCount();
	const setCount = computed(() => store.setCount);

	async function revealSong(song: Song) {
		song.revealed = true;
		await store.saveSongs();
	}

	async function addSet() {
		try {
			const set = JSON.parse(newSet.value) as Song[];
			set.forEach((song) => (song.id = nanoid()));
			await store.addSet(set);
		} catch (error) {
			console.error(error);
			console.error(newSet.value);
			window.alert("Error while saving set, look in devtools for more information");
		}
	}

	await store.loadSongs();

	const interval = setInterval(async () => {
		await store.loadSongs();
		await store.loadPlayers();
	}, 1000);

	onBeforeUnmount(() => {
		clearInterval(interval);
	});
</script>
