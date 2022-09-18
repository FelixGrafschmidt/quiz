<template>
	<div id="player" ref="playerDiv"></div>
</template>

<script setup lang="ts">
	import Player from "yt-player";
	const props = defineProps({ videoid: { type: String, default: "" } });
	const playerDiv = ref<HTMLElement | null>(null);
	let player: Player;
	onMounted(() => {
		player = new Player(playerDiv.value || "", { width: 500 });
		player.load(props.videoid);
	});
	watch(
		() => props.videoid,
		(newValue, oldValue) => {
			if (oldValue !== newValue) {
				player.load(newValue);
			}
		}
	);
</script>
