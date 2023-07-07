<template>
	<div class="min-h-screen bg-gray-800 text-gray-300">
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	import Pusher from "pusher-js";
	onMounted(() => {
		try {
			setupWebSocket();
		} catch (err) {
			console.log(err);
		}
	});
	function setupWebSocket() {
		const pusher = new Pusher("4956cd21dbf523a6c3d4", {
			cluster: "eu",
		});

		const channelName = useRoute().query.game?.toString();

		if (!channelName) {
			return;
		}

		const channel = pusher.subscribe(channelName);
		channel.bind("update", function (data: any) {
			const { key, id, value } = data;
			useStore().update(key, id, value);
		});
	}
</script>

<style>
	@import "@unocss/reset/tailwind.css";
	html {
		scrollbar-gutter: unset;
	}
</style>
