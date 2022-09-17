<template>
	<section my-8 mx-4>
		<client-only>
			<label v-if="!start">
				<span>Please enter your name</span>
				<div mt-2 flex="~ row">
					<input v-model="player.name" type="text" class="px-2 py-1 rounded-l text-black h-8" />
					<button class="rounded-r bg-gray-600 px-8" @click="savePlayer">Save</button>
				</div>
			</label>
			<template v-else>
				<span v-if="!store.session.activeSet" text-lg> Please wait for the game to start. </span>
				<section v-else class="mx-auto my-auto justify-center items-center mt-4" flex="~ col" gap-8>
					<div v-for="(song, i) in songs" :key="i" class="items-center justify-center" border-8 rounded flex="~ col" bg-gray-700>
						<div class="py-4 flex flex-row flex-wrap gap-3 border-y-2 w-full px-4">
							<span v-for="(genre, k) in song.genres" :key="k">{{ genre }}</span>
						</div>
						<div class="flex flex-wrap flex-row w-full gap-4 p-4 items-center justify-center">
							<button
								v-for="j in songs.length"
								:key="j"
								:class="{ 'border-teal border-2': player.guesses[song.id] === j }"
								class="h-16 w-16 text-2xl rounded bg-gray-600"
								@click="guess(song.id, j)"
							>
								{{ j }}
							</button>
						</div>
					</div>
				</section>
			</template>
		</client-only>
	</section>
</template>

<script setup lang="ts">
	import { nanoid } from "nanoid";
	import { ComputedRef } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Song } from "~~/models/interfaces/Song";

	definePageMeta({
		middleware: async (req) => {
			const store = useStore();
			const sessionidParam = req.query.sessionid;

			if (sessionidParam) {
				await store.loadSession(sessionidParam.toString());
				if (!store.session || !store.session.id) {
					showError({ statusCode: 401, statusMessage: "Invalid Request" });
				}
			} else {
				showError({ statusCode: 401, statusMessage: "Invalid Request" });
			}
		},
	});

	const store = useStore();
	const loading = ref(false);
	const start = ref(false);
	const songs: ComputedRef<Song[]> = computed(() => shuffleArray(store.songs));
	let player: Player = { name: "", id: nanoid(), points: 0, guesses: {} };

	if (process.client) {
		const id = window.localStorage.getItem("id");
		const p = store.players.find((p) => p.id === id);
		if (id && p) {
			player = p;
			start.value = true;
		}
		loading.value = false;
	}

	async function savePlayer() {
		await store.savePlayer(player);
		await store.loadSongs();
		start.value = true;
		window.localStorage.setItem("id", player.id);
	}

	async function guess(songid: string, guess: number) {
		player.guesses[songid] = guess;
		await store.savePlayer(player);
	}

	await store.loadSongs();
	await store.loadPlayers();

	// const interval = setInterval(async () => {
	// 	await store.loadSession();
	// 	await store.loadSongs();
	// 	await store.loadPlayers();
	// }, 1000);

	// onBeforeUnmount(() => {
	// 	clearInterval(interval);
	// });

	function shuffleArray(array: Array<Song>) {
		if (!array) return array;
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

	function random(seed: number) {
		const x = Math.sin(seed++) * 10000;
		return x - Math.floor(x);
	}
</script>
