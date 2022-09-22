<template>
	<section px-4>
		<div hidden h-0>
			<AutoPlayer :current="current" :playing="playing" />
		</div>
		<client-only>
			<label v-if="!start">
				<span>Please enter your name</span>
				<div mt-2 flex="~ row">
					<input v-model="player.name" type="text" class="px-2 py-1 rounded-l text-black h-8" />
					<button class="rounded-r bg-gray-600 px-8" @click="savePlayer">Save</button>
				</div>
			</label>
			<template v-else>
				<span v-if="!store.game.activeSet" text-lg> Please wait for the game to start. </span>
				<section v-else-if="songs">
					<swiper ref="swiperRef" :slides-per-view="1" direction="horizontal" h-screen @after-init="swiperInit">
						<swiper-slide v-for="(song, i) in songs" :key="i" flex="~ col" items-center justify-around h-full py-4 px-2>
							<div
								flex="~ row"
								border
								text-2xl
								rounded-full
								py-2
								px-4
								my-2
								relative
								items-center
								gap-2
								@click="play(song.videoid)"
							>
								<span> {{ i + 1 }} / {{ songs.length }} </span>
								<button flex="~ row" items-center>
									<Icon
										:name="song.videoid === current && playing ? 'fa:pause-circle-o' : 'fa:play-circle-o'"
										size="24"
										cursor-pointer
									/>
								</button>
							</div>
							<section flex="~ col" gap-2 w-full>
								<div
									v-for="(s, j) in songs"
									:key="j"
									border-gray-700
									border-2
									:class="{
										'border-teal': player.guesses[song.id] === alphabet[j],
										'opacity-60':
											player.guesses[song.id] !== alphabet[j] && Object.values(player.guesses).includes(alphabet[j]),
									}"
									bg-gray-700
									h-12
									px-2
									flex="~ row"
									items-center
									rounded
									@click="guess(song.id, alphabet[j])"
								>
									<span pr-2 w-6 text-xl flex="~ row" justify-center> {{ alphabet[j] }} </span>
									<div w="90%" text-start>
										<span ref="tags" text-start> {{ s.tags.join(" ~ ") }} </span>
									</div>
								</div>
							</section>
						</swiper-slide>
					</swiper>
				</section>
			</template>
		</client-only>
	</section>
</template>

<script setup lang="ts">
	import { Swiper, SwiperSlide } from "swiper/vue";
	import { Swiper as SwiperClass } from "swiper/types";
	import { nanoid } from "nanoid";
	import { ComputedRef, Ref } from "vue";
	import fitty from "fitty";
	import { Player } from "~~/models/interfaces/Player";
	import { Song } from "~~/models/interfaces/Song";

	const alphabet = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
	];

	definePageMeta({
		middleware: ["game"],
	});

	const swiperRef: Ref<SwiperClass | null> = ref(null);
	const store = useStore();
	const loading = ref(false);
	const start = ref(false);
	const tags = ref<HTMLElement[] | null>(null);
	const current: Ref<string> = ref("");
	const playing: Ref<boolean> = ref(false);
	const songs: ComputedRef<Song[] | undefined> = computed(() => store.game.activeSet?.songs);
	let player: Player = { name: "", id: nanoid(), points: 0, guesses: {} };

	if (process.client) {
		const id = window.localStorage.getItem("id");
		const p = store.game.players.find((p) => p.id === id);
		if (id && p) {
			player = p;
			start.value = true;
		}
		loading.value = false;
	}

	async function savePlayer() {
		await store.add(player);
		start.value = true;
		window.localStorage.setItem("id", player.id);
	}

	async function guess(songid: string, guess: string) {
		const currentPosition = Object.values(player.guesses).findIndex((i) => i === guess);
		if (currentPosition >= 0) {
			if (window.confirm(`${guess} is already selected for song nr. ${currentPosition + 1}. Do you want to switch?`)) {
				await store.guess(songid, player.id, guess);
				await store.guess(Object.keys(player.guesses)[currentPosition], player.id, "");
			}
		} else {
			await store.guess(songid, player.id, guess);
		}
	}

	function play(videoid: string) {
		if (current.value !== videoid) {
			current.value = videoid;
			playing.value = true;
		} else {
			playing.value = !playing.value;
		}
	}

	function swiperInit() {
		tags.value?.forEach((t) => {
			fitty(t, { maxSize: 18, minSize: 12 }).fit();
		});
	}
</script>

<style>
	@import "swiper/css";
</style>
