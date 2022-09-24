<template>
	<section px-4>
		<div hidden h-0>
			<AutoPlayer :current="current" :playing="playing" />
		</div>
		<client-only>
			<label v-if="!store.game.players.find((p) => p.id === playerid)">
				<span>Please enter your name</span>
				<div mt-2 flex="~ row">
					<input
						v-model="name"
						type="text"
						class="px-2 py-1 rounded-l text-black h-8"
						@keydown="$event.code === 'Enter' ? savePlayer() : undefined"
					/>
					<button class="rounded-r bg-gray-600 px-8" @click="savePlayer">Save</button>
				</div>
			</label>
			<template v-else>
				<span v-if="!store.game.activeSet" text-lg> Please wait for the game to start. </span>
				<section v-else-if="songs" overflow-y-auto>
					<swiper ref="swiperRef" :slides-per-view="1" direction="horizontal" @after-init="swiperInit">
						<swiper-slide v-for="(song, i) in songs" :key="i" flex="~ col" items-center justify-evenly h-full py-4 px-2>
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
							{{ song.type }}
							<section v-if="set && player" flex="~ col" gap-2 w-full mt-2>
								<div
									v-for="(letter, answer, j) in set.options"
									:key="j"
									border-gray-700
									border-2
									:class="{
										'border-teal': player.guesses[song.id] === letter,
										'opacity-60': player.guesses[song.id] !== letter && Object.values(player.guesses).includes(letter),
									}"
									bg-gray-700
									h-12
									px-2
									flex="~ row"
									items-center
									cursor-pointer
									rounded
									@click="guess(song.id, letter)"
								>
									<span pr-2 w-6 text-xl flex="~ row" justify-center> {{ letter }} </span>
									<div w="90%" text-start>
										<span ref="tags" text-start> {{ answer.split("|")[1] }} </span>
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
	import { Set } from "~~/models/interfaces/Set";

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
	const player: ComputedRef<Player | undefined> = computed(() => store.game.players.find((p) => p.id === playerid.value));
	const set: ComputedRef<Set | null> = computed(() => store.game.activeSet);
	const playerid = ref("");
	const name = ref("");

	if (process.client) {
		playerid.value = window.localStorage.getItem("id") || "";
		loading.value = false;
	}

	async function savePlayer() {
		let p = player.value;
		if (!p) {
			p = { name: name.value, id: nanoid(), points: 0, guesses: {} };
		}
		await store.add(p);
		start.value = true;
		window.localStorage.setItem("id", playerid.value);
	}

	async function guess(songid: string, guess: string) {
		if (!player.value) {
			return;
		}
		const currentPosition = Object.values(player.value.guesses).findIndex((i) => i === guess);
		if (currentPosition >= 0) {
			if (window.confirm(`${guess} is already selected for song nr. ${currentPosition + 1}. Do you want to switch?`)) {
				await store.guess(songid, playerid.value, guess);
				await store.guess(Object.keys(player.value.guesses)[currentPosition], playerid.value, "");
			}
		} else {
			await store.guess(songid, playerid.value, guess);
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
