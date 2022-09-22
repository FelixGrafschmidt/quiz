<template>
	<div class="min-h-screen bg-gray-800 text-gray-300">
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	onMounted(() => {
		try {
			const ws = new WebSocket(`ws://${window.location.hostname}:4000/?channel=` + useRoute().query.game?.toString());
			ws.onmessage = ({ data }) => {
				const { key, id, value } = JSON.parse(data);
				useStore().update(key, id, value);
			};
		} catch (err) {
			console.log(err);
		}
	});
</script>

<style>
	@import "@unocss/reset/tailwind.css";
	html {
		scrollbar-gutter: unset;
	}
</style>
