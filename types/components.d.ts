declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		LottieAnimation: typeof import("vue3-marquee")["Vue3Marquee"];
	}
}
export {};
