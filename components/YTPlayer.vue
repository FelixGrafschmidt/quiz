<template>
	<div id="player" ref="playerDiv"></div>
</template>

<script setup lang="ts">
	import Player from "yt-player";
	const props = defineProps({ videoid: { type: String, default: "" }, height: { type: Number, default: 0 } });
	const playerDiv = ref<HTMLElement | null>(null);
	let player: Player;
	onMounted(() => {
		player = new Player(playerDiv.value || "", { height: (props.height * window.innerHeight) / 100, width: 480 });
		player.setVolume(50);
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
