<template>
	<section class="mx-auto my-auto justify-center items-center text-lg [zoom:110%]" flex="~ row wrap" gap-8>
		<div v-for="(song, i) in songs" :key="i" class="items-center justify-center" border-8 rounded flex="~ col" w="1/6" bg-gray-700>
			<div class="flex flex-col items-center" :class="{ 'filter-blur-md': !song.revealed }" py-4 gap-2>
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
			<div flex="~ row" gap-6 py-4>
				<div v-for="(player, j) in players" :key="j" class="w-30% flex flex-col justify-center items-center gap-2">
					{{ player.name }}
					<span v-if="song.correct.includes(player.id)" :class="{ invisible: !song.revealed }" class="text-2rem text-green">
						O
					</span>
					<span v-else :class="{ invisible: !song.revealed }" class="text-2rem text-red">X</span>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	const store = useStore();
	let songs = store.songs;
	const players = store.players;

	const interval = setInterval(() => {
		songs = store.songs;
	}, 1000);

	onBeforeUnmount(() => {
		clearInterval(interval);
	});
</script>
