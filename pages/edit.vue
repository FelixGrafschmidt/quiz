<template>
	<section py-8 mx-4 flex="~ row" justify-start>
		<template v-if="!searchOpen">
			<section bg-gray-700 rounded p-4 h-90vh mr="1%" w="30%" min-w="30%">
				<div flex="~ row items-center gap-4">
					<span text-xl>Select Set to edit</span>
					<button h-8 rounded bg-gray-600 px-2 @click="addSet">Add Set</button>
				</div>
				<div
					flex="~ row wrap"
					max-h-96
					px-2
					my-4
					border-y
					py-4
					overflow-y-auto
					scrollbar="~ rounded w-4px radius-2 track-radius-4 thumb-radius-4 track-color-gray-400 thumb-color-gray-600"
					gap-4
				>
					<button
						v-for="(s, i) in store.game.sets"
						:key="i"
						:class="{ 'border-teal border-2': set === s }"
						h-12
						rounded
						bg-gray-600
						w-20
						px-2
						whitespace="nowrap"
						text-ellipsis
						overflow-hidden
						@click="selectSet(s)"
					>
						<span>{{ s.name }}</span>
					</button>
				</div>
			</section>
			<section v-if="set" bg-gray-700 rounded h-90vh p-4 mr="1%" flex="~ col" justify-between gap-2 w="30%" min-w="30%">
				<label flex="~ col gap-2">
					<span text-2xl>Name</span>
					<input v-model="set.name" type="text" class="px-2 py-1 rounded text-black h-8" />
				</label>
				<div flex="~ row " items-start justify-start gap-4 my-2>
					<span text-2xl>Songs</span>
					<button h-8 rounded bg-gray-600 px-2 @click="addSong">Add Song</button>
				</div>
				<div
					v-if="set.songs.length"
					flex="~ col gap-2 grow"
					border-y
					p-2
					overflow-y-auto
					scrollbar="~ rounded w-4px radius-2 track-radius-4 thumb-radius-4 track-color-gray-400 thumb-color-gray-600"
				>
					<span v-for="(s, i) in set.songs" :key="i" :class="{ 'text-teal': song === s }" cursor-pointer @click="selectSong(s)">{{
						s.name
					}}</span>
				</div>
				<div self-end w-full min-h-28 flex="~ col" justify-end>
					<button self-end h-12 rounded bg-green-800 w-full px-2 @click="saveSet">Save Set</button>
					<button self-end h-12 rounded bg-red-600 w-full px-2 mt-2 @click="deleteSet">Delete Set</button>
				</div>
			</section>
		</template>
		<section v-else flex="~ col" gap-4 w="61%" bg-gray-700 rounded p-4 h-90vh mr="1%" min-w="61%">
			<div h="1/2" relative>
				<div flex="~ row">
					<label mr-4>
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
					<div flex="~ row gap-2" items-end>
						<button
							:class="!store.previousPageToken ? 'bg-gray-500' : 'bg-gray-600'"
							:disabled="!store.previousPageToken"
							w-24
							h="1/2"
							px-4
							rounded
							@click="previousPage"
						>
							Previous
						</button>
						<button
							:class="!store.nextPageToken ? 'bg-gray-500' : 'bg-gray-600'"
							:disabled="!store.nextPageToken"
							w-24
							h="1/2"
							px-4
							rounded
							@click="nextPage"
						>
							Next
						</button>
					</div>
				</div>
				<button absolute right-0 top-0 @click="closeSearch">
					<Icon name="fa:close" />
				</button>
				<section v-if="store.searchResult.data?.items" mt-4 flex="~ col wrap" max-h-60 gap-2>
					<div v-for="(item, i) in store.searchResult.data.items" :key="i" py-2 flex="~ row" items-center gap-2>
						<Icon
							:name="item.id?.videoId === current && playing ? 'fa:pause-circle-o' : 'fa:play-circle-o'"
							size="24"
							cursor-pointer
							@click="play(item)"
						/>
						<span :class="{ 'text-teal': item.id?.videoId === current }">{{ item.snippet?.title?.trim() }}</span>
						<button h-6 rounded bg-gray-600 px-2 @click="selectVideo(item.id?.videoId || '')">Select</button>
					</div>
				</section>
			</div>
			<div h="1/2" w-full>
				<div mx-auto>
					<AutoPlayer v-if="set" :current-prop="current" :playing-prop="playing" :height="40" />
				</div>
			</div>
		</section>
		<section v-if="song" bg-gray-700 rounded h-90vh p-4 flex="~ col gap-2" justify-between self-end w-full>
			<div flex="~ row" gap-2 justify-around h="35%" max-h="35%">
				<div w="45%">
					<label flex="~ col gap-2">
						<span text-2xl>Name</span>
						<input v-model="song.name" type="text" px-2 py-1 rounded text-black h-8 />
					</label>
					<label flex="~ col gap-2" mt-2>
						<span text-lg>Origin</span>
						<input v-model="song.origin" type="text" px-2 py-1 rounded text-black h-8 />
					</label>
					<label flex="~ col gap-2" mt-2>
						<span text-lg>Type</span>
						<select v-model="song.type" px-2 py-1 rounded text-black h-8>
							<option hidden value="" disabled></option>
							<option value="opening">Opening</option>
							<option value="ending">Ending</option>
							<option value="insert">Insert</option>
						</select>
					</label>
				</div>
				<div w="45%">
					<div flex="~ row items-center gap-4">
						<span text-lg>Tags</span>
						<button h-8 rounded bg-gray-600 px-2 @click="addTag">Add Tag</button>
					</div>
					<div
						v-if="song.tags.length"
						flex="~ col gap-2"
						border-y
						mt-2
						h-full
						p-2
						overflow-y-auto
						scrollbar="~ rounded w-4px radius-2 track-radius-4 thumb-radius-4 track-color-gray-400 thumb-color-gray-600"
					>
						<span
							v-for="(tag, i) in song.tags"
							:key="i"
							cursor-pointer
							hover="text-red-600 line-through"
							@click="deleteTag(tag)"
							>{{ tag }}</span
						>
					</div>
				</div>
			</div>
			<div flex-grow>
				<div flex="~ row items-center gap-4 " my-2>
					<span text-lg>Video</span>
					<button h-8 rounded bg-gray-600 px-2 @click="openSearch">
						<span v-if="song.videoid">Change</span>
						<span v-else>Add</span>
					</button>
				</div>
				<div v-if="song.videoid">
					<YTPlayer :videoid="song.videoid" :height="32" />
				</div>
			</div>
			<div self-end w-full min-h-28 flex="~ col" justify-end>
				<button self-end h-12 rounded bg-green-800 w-full px-2 @click="saveSong">Save Song</button>
				<button self-end h-12 rounded bg-red-600 w-full px-2 mt-2 @click="deleteSong">Delete Song</button>
			</div>
		</section>
	</section>
</template>

<script setup lang="ts">
	import { youtube_v3 as ytV3 } from "@googleapis/youtube";
	import { GaxiosResponse } from "gaxios";

	import { nanoid } from "nanoid";
	import { Ref } from "vue";
	import { Set } from "~~/models/interfaces/Set";
	import { Song } from "~~/models/interfaces/Song";
	definePageMeta({
		middleware: ["game"],
	});

	const store = useStore();
	const set: Ref<Set | null> = ref(null);
	const song: Ref<Song | null> = ref(null);
	const searchOpen = ref(false);
	const query = ref("");
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
	function selectSet(s: Set) {
		set.value = s;
		song.value = null;
	}
	function addSet() {
		set.value = { id: nanoid(), name: "", songs: [], options: {} };
		song.value = null;
	}
	function deleteSet() {
		if (set.value) {
			store.deleteSet(set.value);
			set.value = null;
		}
	}
	async function saveSet() {
		if (set.value) {
			await store.addSet(set.value);
			set.value = null;
		}
	}
	function selectSong(s: Song) {
		song.value = s;
	}
	function addSong() {
		song.value = { id: nanoid(), name: "", tags: [], origin: "", revealed: false, videoid: "", type: "", playing: false, answer: "" };
	}
	function deleteSong() {
		if (song.value && set.value) {
			set.value.songs = set.value?.songs.filter((s) => s.id !== song.value?.id);
		}
		song.value = null;
	}
	function saveSong() {
		if (song.value && set.value) {
			set.value.songs = set.value?.songs.filter((s) => s.id !== song.value?.id);
			set.value.songs.push(song.value);
		}
		song.value = null;
	}
	function addTag() {
		const tags = window.prompt("New Tag")?.split(", ");
		if (tags) {
			song.value?.tags.push(...tags);
		}
	}
	function deleteTag(tag: string) {
		if (!song.value) return;
		song.value.tags = song.value?.tags.filter((t) => t !== tag) || [];
	}
	async function openSearch() {
		store.searchResult = {} as GaxiosResponse<ytV3.Schema$SearchListResponse>;
		query.value = `${song.value?.origin} ${song.value?.name} ${song.value?.type}`;
		searchOpen.value = true;
		await search();
	}
	async function nextPage() {
		await store.nextPage(query.value);
	}
	async function previousPage() {
		await store.previousPage(query.value);
	}
	function closeSearch() {
		searchOpen.value = false;
	}
	function selectVideo(videoid: string) {
		if (!song.value) return;
		song.value.videoid = videoid;
		searchOpen.value = false;
	}
</script>
