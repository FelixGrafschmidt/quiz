<template>
	<div>
		<section class="w-full bg-gray-600 flex items-center flex-row justify-around border-b-2 divide-x">
			<button class="w-1/2 h-16 flex items-center justify-center" @click="mode = 'prep'">Preparation</button>
			<button class="w-1/2 h-16 flex items-center justify-center" @click="mode = 'game'">Game</button>
		</section>
		<section v-if="mode === 'prep'" class="divide-y flex flex-col">
			<div py-4>
				<span class="text-xl">Connected Players</span>
			</div>
			<div py-4 class="flex flex-row flex-wrap gap-4 items-center justify-center">
				<button class="h-12 w-45% rounded bg-gray-600">Start Set 1</button>
				<button class="h-12 w-45% rounded bg-gray-600">Start Set 2</button>
				<button class="h-12 w-45% rounded bg-gray-600">Start Set 3</button>
				<button class="h-12 w-45% rounded bg-gray-600">Start Set 4</button>
				<button class="h-12 w-45% rounded bg-gray-600">Start Set 5</button>
			</div>
			<div py-4>
				<span class="text-xl">Create new Set</span>
				<textarea v-model="newSet" class="rounded my-2 text-black" cols="30" rows="10"></textarea>
				<button class="h-12 rounded bg-gray-600" @click="addSet">Save</button>
			</div>
		</section>
		<section v-else-if="mode === 'game'" class="mx-auto my-auto justify-center items-center" flex="~ col" gap-8>
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
					<button
						class="h-full w-full p-4"
						@click="
							song.revealed = true;
							$forceUpdate();
						"
					>
						Reveal?
					</button>
				</div>
				<div v-else p-4>Revealed</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { Song } from "~~/models/interfaces/Song";

	const store = useStore();
	const songs = store.songs;
	const mode = ref("prep");
	const newSet = ref("");
	async function addSet() {
		try {
			const set = JSON.parse(newSet.value) as Song[];
			await store.addSet(set);
		} catch (error) {
			console.error(error);
			console.error(newSet.value);
			window.alert("Error while saving set, look in devtools for more information");
		}
	}
</script>
