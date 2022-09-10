<template>
	<section v-if="!songs.length" class="mx-auto my-auto">
		<img src="/qr.svg" />
	</section>
	<section v-else class="mx-auto my-auto justify-center items-center text-lg [zoom:110%]" flex="~ row wrap" gap-8>
		<div v-for="(song, i) in songs" :key="i" class="items-center justify-center h-90" border-8 rounded flex="~ col" w="1/6" bg-gray-700>
			<div class="flex flex-col items-center min-h-35%" :class="{ 'filter-blur-md': !song.revealed }" py-2 gap-2>
				<div class="text-3rem">
					{{ (songs.indexOf(song) + 1).toString().padStart(2, "0") }}
				</div>
				<div class="flex flex-col w-full items-center justify-center">
					<div class="text-xl font-extrabold flex flex-col text-center">
						{{ song.origin }}
					</div>
					<div class="italic text-sm">{{ song.name }}</div>
				</div>
			</div>
			<div class="py-2 flex-grow border-y-2 w-full">
				<div class="flex flex-row flex-wrap gap-3 px-4">
					<span v-for="(genre, k) in song.genres" :key="k">{{ genre }}</span>
				</div>
			</div>
			<div flex="~ row" class="h-25%" gap-4 py-2>
				<div v-for="(player, j) in players" :key="j" class="flex flex-col justify-center items-center gap-2">
					<span :class="{ 'opacity-40': !player.guesses[song.id] }">
						{{ player.name }}
					</span>
					<span
						v-if="originalSongs.findIndex((s) => s.id === song.id) + 1 === player.guesses[song.id]"
						:class="{ invisible: !song.revealed }"
						class="text-2rem text-green"
					>
						O
					</span>
					<span v-else :class="{ invisible: !song.revealed }" class="text-2rem text-red">X</span>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { ComputedRef } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Song } from "~~/models/interfaces/Song";

	const store = useStore();
	const songs: ComputedRef<Song[]> = computed(() => shuffleArray(store.songs));
	const originalSongs: ComputedRef<Song[]> = computed(() => store.songs);
	const players: ComputedRef<Player[]> = computed(() => store.players);

	await store.loadSongs();
	await store.loadPlayers();

	const interval = setInterval(async () => {
		await store.loadSongs();
		await store.loadPlayers();
	}, 1000);

	onBeforeUnmount(() => {
		clearInterval(interval);
	});

	function shuffleArray(array: Array<Song>) {
		const arrayCopy = JSON.parse(JSON.stringify(array)) as Array<Song>;
		let seed = array.reduce((prev, curr) => {
			prev += curr.name.length;
			return prev;
		}, 0);

		let m = arrayCopy.length;
		let t: Song;
		let i: number;

		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(random(seed) * m--);

			// And swap it with the current element.
			t = arrayCopy[m];
			arrayCopy[m] = arrayCopy[i];
			arrayCopy[i] = t;
			++seed;
		}
		return arrayCopy;
	}

	function random(seed) {
		const x = Math.sin(seed++) * 10000;
		return x - Math.floor(x);
	}
</script>
