<template>
	<div class="min-h-screen bg-gray-800 text-gray-300">
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	onMounted(() => {
		try {
			setupWebSocket();
		} catch (err) {
			console.log(err);
		}
	});
	function setupWebSocket() {
		const ws = useRuntimeConfig().dev
			? new WebSocket(`ws://${window.location.hostname}:4000/ws?channel=` + useRoute().query.game?.toString())
			: new WebSocket(`wss://${window.location.hostname}/ws?channel=` + useRoute().query.game?.toString());
		ws.onmessage = ({ data }) => {
			const { key, id, value } = JSON.parse(data);
			useStore().update(key, id, value);
		};
		ws.onclose = function () {
			setTimeout(() => setupWebSocket(), 1000);
		};
	}
</script>

<style>
	@import "@unocss/reset/tailwind.css";
	html {
		scrollbar-gutter: unset;
	}
</style>
