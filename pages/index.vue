<template>
	<section v-if="!store.session.activeSet" class="mx-auto my-auto flex flex-row gap-64">
		<a target="_blank" :href="'/player?sessionid=' + store.session.id" class="[zoom:250%]">
			<span class="flex flex-row justify-center mb-4">Players</span>
			<img :src="qrPlayer" />
		</a>
		<a target="_blank" :href="'/master?sessionid=' + store.session.id" class="[zoom:250%]">
			<span class="flex flex-row justify-center mb-4">Game Master</span>
			<img :src="qrMaster" />
		</a>
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
	import { create, toDataURL } from "qrcode";
	import { ComputedRef, useSSRContext } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Song } from "~~/models/interfaces/Song";

	definePageMeta({
		middleware: async (req) => {
			const store = useStore();
			const sessionidParam = req.query.sessionid;

			if (sessionidParam) {
				await store.loadSession(sessionidParam.toString());
				if (!store.session || !store.session.id) {
					const id = (await store.createSession()).id;
					const target = { path: "/", query: { sessionid: id } };
					return navigateTo(target);
				}
			} else {
				const id = (await store.createSession()).id;
				const target = { path: "/", query: { sessionid: id } };
				return navigateTo(target);
			}
		},
	});

	const store = useStore();
	let qrMaster = "";
	let qrPlayer = "";
	const songs: ComputedRef<Song[]> = computed(() => shuffleArray(store.songs));
	const originalSongs: ComputedRef<Song[]> = computed(() => store.songs);
	const players: ComputedRef<Player[]> = computed(() => store.players);

	if (process.server && useSSRContext()?.req.url) {
		const req = useSSRContext()?.req;
		const urlMaster = new URL("/master", `http://${req.headers.host}`);
		urlMaster.searchParams.append("sessionid", store.session.id);
		qrMaster = await toDataURL(create(urlMaster.toString()).segments);
		const urlPlayers = new URL("/player", `http://${req.headers.host}`);
		urlPlayers.searchParams.append("sessionid", store.session.id);
		qrPlayer = await toDataURL(create(urlPlayers.toString()).segments);
	} else {
		const url = new URL(window.location.href);
		url.pathname = "/master";
		url.searchParams.append("sessionid", store.session.id);
		qrMaster = await toDataURL(create(url.toString()).segments);
		url.pathname = "/player";
		qrPlayer = await toDataURL(create(url.toString()).segments);
	}

	await store.loadSongs();
	await store.loadPlayers();

	const interval = setInterval(async () => {
		await store.loadSession();
		await store.loadSongs();
		await store.loadPlayers();
	}, 1000);

	onBeforeUnmount(() => {
		clearInterval(interval);
	});

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
