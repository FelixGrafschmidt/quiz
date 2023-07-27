<template>
	<div id="player" ref="playerDiv"></div>
</template>

<script setup lang="ts">
	import Player from "yt-player";
	const props = defineProps({ playingProp: Boolean, currentProp: { type: String, default: "" }, height: { type: Number, default: 0 } });
	const current = ref("");
	const playing = ref(false);
	const playerDiv = ref<HTMLElement | null>(null);
	let player: Player;
	onMounted(() => {
		player = new Player(playerDiv.value || "", { height: (props.height * window.innerHeight) / 100, width: 480 });
		player.setVolume(50);
	});
	// Is there a race condition between the two watchers? Could we switch this around to eplicitly call the functions from the top instead of watchers?
	watch(
		() => props.playingProp,
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
		() => props.currentProp,
		(newValue, oldValue) => {
			if (oldValue !== newValue) {
				current.value = newValue;
				player.load(current.value, true);
			}
		}
	);
</script>
