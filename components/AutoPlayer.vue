<template>
	<div id="player" ref="playerDiv"></div>
</template>

<script setup lang="ts">
	import Player from "yt-player";
	const props = defineProps({ playing: Boolean, current: { type: String, default: "" }, height: { type: Number, default: 0 } });
	const current = ref("");
	const playing = ref(false);
	const playerDiv = ref<HTMLElement | null>(null);
	let player: Player;
	onMounted(() => {
		player = new Player(playerDiv.value || "", { height: (props.height * window.innerHeight) / 100, width: 480 });
		player.setVolume(50);
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
