import assert from "node:assert";
import { suite, test } from "node:test";
import { toUpper } from "es-toolkit/compat";
import { formatTokens, wrapCss, wrapJs } from "../src/build/format.ts";

suite("formatTokens function", () => {
	const dummyTokens = {
		primary: "#ffffff",
		secondary: "#000000",
		nested: {
			tertiary: "#ff00ff",
		},
	};
	const folderName = "color";
	const device = "phone";
	const result = formatTokens(dummyTokens, folderName, device, [], true);

	test("should generate a header containing the capitalized folder name", () => {
		assert.match(result.header, /Color/);
	});

	test("should generate correct CSS variable declarations", () => {
		assert.ok(
			result.cssVars.includes(
				`--nds-${device}-${folderName}-primary: #ffffff;`,
			),
		);
		assert.ok(
			result.cssVars.includes(
				`--nds-${device}-${folderName}-nested-tertiary: #ff00ff;`,
			),
		);
	});

	test("should generate correct JS export statements", () => {
		assert.ok(
			result.jsExports.includes(
				`export const ${toUpper(device)}_${toUpper(folderName)}_PRIMARY = "#ffffff";`,
			),
		);
		assert.ok(
			result.jsExports.includes(
				`export const ${toUpper(device)}_${toUpper(folderName)}_NESTED_TERTIARY = "#ff00ff";`,
			),
		);
	});

	test('should include a ":root" block in the CSS output', () => {
		assert.match(result.css, /:root {/);
	});

	test("should include the correct export in the JS output", () => {
		assert.ok(
			result.js.includes(
				`export const ${toUpper(device)}_${toUpper(folderName)}_PRIMARY = "#ffffff";`,
			),
		);
	});
});

suite("wrapCss and wrapJs functions", () => {
	test("should wrap CSS groups correctly", () => {
		const groups = [
			{
				header: "/* Test Header */",
				cssVars: ["--test: 1px;", "--example: 2px;"],
			},
		];
		const wrapped = wrapCss(groups);
		assert.match(wrapped, /:root \{/);
		assert.match(wrapped, /--test: 1px;/);
		assert.match(wrapped, /\/\* Test Header \*\//);
	});

	test("should wrap JS groups correctly", () => {
		const groups = [
			{
				header: "/* Test JS Header */",
				jsExports: ['export const TEST = "value";'],
			},
		];
		const wrapped = wrapJs(groups);
		assert.match(wrapped, /export const TEST = "value";/);
		assert.match(wrapped, /\/\* Test JS Header \*\//);
	});
});
