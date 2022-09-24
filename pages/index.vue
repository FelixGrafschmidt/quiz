<template>
	<section v-if="!store.game.activeSet" mx-auto items-center h-screen my-auto gap-64 justify-center flex="~ row">
		<a target="_blank" :href="'/player?game=' + store.game.id" class="[zoom:250%]">
			<span flex flex-row justify-center mb-4>Players</span>
			<img :src="qrPlayer" />
		</a>
		<a target="_blank" :href="'/master?game=' + store.game.id" class="[zoom:250%]">
			<span flex flex-row justify-center mb-4>Game Master</span>
			<img :src="qrMaster" />
		</a>
	</section>
	<section v-else-if="set">
		<div hidden h-0>
			<AutoPlayer :current="currentlyPlaying?.videoid" :playing="store.playing" />
		</div>
		<section mx-auto my-auto justify-center items-center text-lg class="[zoom:110%]" flex="~ row wrap" gap-8>
			<div v-for="(song, i) in set.songs" :key="i" items-center justify-center h-90 border-8 rounded flex="~ col" w="1/6" bg-gray-700>
				<div flex flex-col items-center min-h="35%" max-h="35%" w-full pt-2>
					<div text-3rem h="30%" mb-2>
						{{ (set.songs.indexOf(song) + 1).toString().padStart(2, "0") }} &rarr;
						<span :class="{ 'filter-blur-md': !song.revealed }">
							{{ set.options[song.answer] }}
						</span>
					</div>
					<div flex flex-col w-full items-center justify-center h-full :class="{ 'filter-blur-md': !song.revealed }">
						<div ref="names" font-extrabold flex flex-col text-center max-w-full px-1>
							{{ song.origin }}
						</div>
						<div italic text-sm>{{ song.name }}</div>
					</div>
				</div>
				<div py-2 flex-grow border-y-2 w-full>
					<div ref="tags" px-2 text-center :class="{ '!hidden': !song.revealed }">
						{{ song.answer.split("|")[1] }}
					</div>
				</div>
				<div flex="~ row" h="25%" gap-4 py-2>
					<div v-for="(player, j) in players" :key="j" flex flex-col justify-center items-center gap-2>
						<span :class="{ 'opacity-40': !player.guesses[song.id] }">
							{{ player.name }}
						</span>
						<span
							v-if="set.options[song.answer] === player.guesses[song.id]"
							:class="{ invisible: !song.revealed }"
							text-2rem
							text-green
						>
							{{ player.guesses[song.id] }}
						</span>
						<span v-else :class="{ invisible: !song.revealed }" text-2rem text-red>{{ player.guesses[song.id] }}</span>
					</div>
				</div>
			</div>
		</section>
	</section>
	<section v-else></section>
</template>

<script setup lang="ts">
	import { create, toDataURL } from "qrcode";
	import { ComputedRef, useSSRContext } from "vue";
	import fitty from "fitty";
	import { Player } from "~~/models/interfaces/Player";
	import { Set } from "~~/models/interfaces/Set";
	import { Song } from "~~/models/interfaces/Song";

	definePageMeta({
		middleware: ["gameinit"],
	});

	onMounted(() => {
		names.value?.forEach((name) => {
			fitty(name, { maxSize: 20, minSize: 10 }).fit();
		});
		tags.value?.forEach((t) => {
			fitty(t, { maxSize: 18 }).fit();
		});
	});
	onUpdated(() => {
		names.value?.forEach((name) => {
			fitty(name, { maxSize: 20, minSize: 10 }).fit();
		});
		tags.value?.forEach((t) => {
			fitty(t, { maxSize: 18 }).fit();
		});
	});

	const store = useStore();
	let qrMaster = "";
	let qrPlayer = "";
	const names = ref<HTMLElement[] | null>(null);
	const tags = ref<HTMLElement[] | null>(null);
	const set: ComputedRef<Set | null> = computed(() => store.game.activeSet);
	// const setOrig: ComputedRef<Set | null> = computed(() => store.game.activeSetOrig);
	const players: ComputedRef<Player[] | null> = computed(() => store.game.players);

	const currentlyPlaying: ComputedRef<Song | undefined> = computed(() => store.game.activeSet?.songs.find((song) => song.playing));

	if (process.server && useSSRContext()?.req.url) {
		const req = useSSRContext()?.req;
		const urlMaster = new URL("/master", `http://${req.headers.host}`);
		urlMaster.searchParams.append("game", store.game.id);
		qrMaster = await toDataURL(create(urlMaster.toString()).segments);
		const urlPlayers = new URL("/player", `http://${req.headers.host}`);
		urlPlayers.searchParams.append("game", store.game.id);
		qrPlayer = await toDataURL(create(urlPlayers.toString()).segments);
	} else {
		const url = new URL(window.location.href);
		url.pathname = "/master";
		url.searchParams.append("game", store.game.id);
		qrMaster = await toDataURL(create(url.toString()).segments);
		url.pathname = "/player";
		qrPlayer = await toDataURL(create(url.toString()).segments);
	}
</script>
