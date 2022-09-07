<template>
	<section v-if="master"><MasterView /></section>
	<section v-else>
		<div v-for="(song, i) in data.songs" :key="i">
			<div class="font-bold my-4 flex items-center justify-center">{{ song.name }}</div>
			<div class="rounded bg-gray-600 flex flex-col items-center justify-center">
				<span v-for="(genre, j) in song.genres" :key="j" class="py-2 border-b border-t flex items-center justify-center w-full">
					{{ genre }}
				</span>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import hash from "object-hash";
	import MasterView from "./components/MasterView.vue";

	interface Player {
		name: string;
		points: number;
	}
	interface Song {
		name: string;
		origin: string;
		genres: string[];
		revealed: boolean;
	}

	interface Data {
		songs: Song[];
		players: Player[];
	}

	export default defineComponent({
		components: { MasterView },
		data() {
			return {
				master: false,
				interval: -1,
				data: {} as Data,
			};
		},
		async created() {
			this.master = !!new URL(window.location.href).searchParams.get("master");
			this.data = (await this.axios.get("https://json.extendsclass.com/bin/a9857a209d8f")).data as Data;
			this.interval = window.setInterval(async () => {
				const responseData = (
					await this.axios.get("https://json.extendsclass.com/bin/a9857a209d8f", {
						headers: {
							"Cache-Control": "no-cache",
							Pragma: "no-cache",
							Expires: "0",
						},
					})
				).data as Data;
				if (hash(responseData) !== hash(this.data)) {
					this.data = responseData;
				}
			}, 1000);
		},
		beforeUnmount() {
			window.clearInterval(this.interval);
		},
		methods: {},
	});
</script>

<style lang="postcss">
	body {
		@apply bg-gray-800 text-gray-300;
	}
</style>
