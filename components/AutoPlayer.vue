<template>
	<div id="player" ref="playerDiv"></div>
</template>

<script setup lang="ts">
	import Player from "yt-player";
	const props = defineProps({ playing: Boolean, current: { type: String, default: "" } });
	const current = ref("");
	const playing = ref(false);
	const playerDiv = ref<HTMLElement | null>(null);
	let player: Player;
	onMounted(() => {
		player = new Player(playerDiv.value || "");
	});
	watch(
		() => props.playing,
		() => {
			if (playing.value) {
				player.pause();
				playing.value = false;
			} else {
				player.play();
				playing.value = true;
			}
		}
	);
	watch(
		() => props.current,
		(newValue, oldValue) => {
			if (oldValue !== newValue) {
				current.value = newValue;
				player.load(current.value, true);
			}
		}
	);
</script>
