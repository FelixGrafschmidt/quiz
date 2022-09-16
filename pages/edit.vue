<template>
	<section v-if="!set"></section>
	<section v-else flex="~ row" gap-4 my-8 mx-4>
		<div w="1/2">
			<label>
				<span>Enter query</span>
				<div mt-2 flex="~ row">
					<input
						v-model="query"
						name="animequiz-search"
						type="text"
						px-2
						py-1
						rounded-l
						text-black
						h-8
						@keydown="$event.code === 'Enter' ? search() : undefined"
					/>
					<button rounded-r bg-gray-600 px-8 @click="search">Search</button>
				</div>
			</label>
			<section v-if="store.searchResult.data?.items" mt-4>
				<div v-for="(item, i) in store.searchResult.data.items" :key="i" py-2 flex="~ row" items-center gap-2>
					<Icon name="fa:play-circle-o" size="24" cursor-pointer @click="play(item)" />
					{{ item.snippet?.title?.trim() }}
				</div>
			</section>
		</div>
		<div w="1/2">
			<player v-if="set" :current="current" :playing="playing" />
		</div>
	</section>
</template>

<script setup lang="ts">
	import { youtube_v3 as ytV3 } from "@googleapis/youtube";
	import { Song } from "~~/models/interfaces/Song";
	const store = useStore();
	const query = ref("");
	const set: Song[] | null = null;
	const playing = ref(false);
	const current = ref("");
	async function search() {
		await store.search(query.value);
	}
	function play(item: ytV3.Schema$SearchResult) {
		if (current.value !== item.id?.videoId) {
			current.value = item.id?.videoId || "";
			playing.value = true;
		} else {
			playing.value = !playing.value;
		}
	}
</script>
