<template>
	<section class="mx-auto my-auto justify-center items-center" flex="~ row wrap" gap-8>
		<div v-for="(song, i) in songs" :key="i" class="items-center justify-center" border-8 flex="~ col" w="1/6">
			<div :class="{ 'filter-blur-md': !song.revealed }" class="text-3rem">
				{{ (songs.indexOf(song) + 1).toString().padStart(2, "0") }}
			</div>
			<div class="flex flex-col w-full">
				<div :class="{ 'filter-blur': !song.revealed }" class="text-xl font-extrabold">{{ song.origin }}</div>
				<div :class="{ 'filter-blur': !song.revealed }" class="italic text-sm">{{ song.name }}</div>
				<div class="">{{ song.genres.join(", ") }}</div>
			</div>
			<div flex="~ row">
				<div v-for="(player, j) in players" :key="j" class="w-5% px-2 flex flex-col justify-center items-center">
					{{ player.name }}
					<span v-if="song.correct.includes(player.id)" :invisible="!song.revealed" class="text-3rem text-green">O</span>
					<span v-else :invisible="!song.revealed" class="text-3rem text-red">X</span>
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
