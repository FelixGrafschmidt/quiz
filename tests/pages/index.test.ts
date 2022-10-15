import { describe, expect, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils-edge";

describe("Setup", async () => {
	await setup({});

	test("my test", () => {
		expect();
	});
});
