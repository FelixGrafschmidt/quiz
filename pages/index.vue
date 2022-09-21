<template>
	<section v-if="!store.game.activeSet" class="mx-auto my-auto flex flex-row gap-64">
		<a target="_blank" :href="'/player?game=' + store.game.id" class="[zoom:250%]">
			<span class="flex flex-row justify-center mb-4">Players</span>
			<img :src="qrPlayer" />
		</a>
		<a target="_blank" :href="'/master?game=' + store.game.id" class="[zoom:250%]">
			<span class="flex flex-row justify-center mb-4">Game Master</span>
			<img :src="qrMaster" />
		</a>
	</section>
	<section v-else-if="set && setOrig">
		<div invisible h-0>
			<AutoPlayer :current="currentlyPlaying?.videoid" :playing="store.playing" />
		</div>
		<section class="mx-auto my-auto justify-center items-center text-lg [zoom:110%]" flex="~ row wrap" gap-8>
			<div
				v-for="(song, i) in set.songs"
				:key="i"
				class="items-center justify-center h-90"
				border-8
				rounded
				flex="~ col"
				w="1/6"
				bg-gray-700
			>
				<div class="flex flex-col items-center min-h-35%" :class="{ 'filter-blur-md': !song.revealed }" py-2 gap-2>
					<div class="text-3rem">
						{{ (set.songs.indexOf(song) + 1).toString().padStart(2, "0") }}
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
						<span v-for="(genre, k) in song.tags" :key="k">{{ genre }}</span>
					</div>
				</div>
				<div flex="~ row" class="h-25%" gap-4 py-2>
					<div v-for="(player, j) in players" :key="j" class="flex flex-col justify-center items-center gap-2">
						<span :class="{ 'opacity-40': !player.guesses[song.id] }">
							{{ player.name }}
						</span>
						<span
							v-if="setOrig.songs.find((s) => s.id === song.id)!.id === player.guesses[song.id]"
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
	</section>
	<section v-else></section>
</template>

<script setup lang="ts">
	import { create, toDataURL } from "qrcode";
	import { ComputedRef, useSSRContext } from "vue";
	import { Player } from "~~/models/interfaces/Player";
	import { Set } from "~~/models/interfaces/Set";
	import { Song } from "~~/models/interfaces/Song";

	definePageMeta({
		middleware: ["gameinit"],
	});

	const store = useStore();
	let qrMaster = "";
	let qrPlayer = "";
	const set: ComputedRef<Set | null> = computed(() => store.game.activeSet);
	const setOrig: ComputedRef<Set | null> = computed(() => store.game.activeSetOrig);
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
