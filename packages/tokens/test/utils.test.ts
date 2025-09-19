import assert from "node:assert";
import { suite, test } from "node:test";
import { fmt, n, pct, px } from "../src/utils.ts";

suite("Utils functions", () => {
	test("should format pixels correctly", () => {
		assert.equal(px(10), "10px");
	});

	test("should format percentages correctly", () => {
		assert.equal(pct(50), "50%");
	});

	test("should format numbers with fmt correctly", () => {
		const formatted = fmt(4.14159);
		assert.equal(typeof formatted, "string");
		assert.equal(Number.parseFloat(formatted), 4.1416);
	});

	test("should parse numbers with n correctly", () => {
		assert.equal(n("3.14"), 3.14);
	});
});
