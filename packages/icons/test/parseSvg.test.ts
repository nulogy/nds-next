import assert from "node:assert";
import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import parseSvg from "../src/parseSvg.ts";

const __filename = fileURLToPath(import.meta.url);
const ASSETS_DIR = path.join(path.dirname(__filename), "..", "assets");

// Common test SVG data
const TEST_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

suite("parseSvg", () => {
	suite("Basic Tests", () => {
		test("Basic SVG parsing with sax parser", () => {
			const { viewBox, path: svgPath } = parseSvg(TEST_SVG);
			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath[0], "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
		});

		// ===== VIEWBOX EXTRACTION TESTS =====
		test("extracts viewBox from lowercase attribute", () => {
			const svg = '<svg viewbox="0 0 24 24"><path d="M12 2"/></svg>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		test("extracts viewBox from camelCase attribute", () => {
			const svg = '<svg viewBox="0 0 24 24"><path d="M12 2"/></svg>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		test("prefers lowercase viewbox over camelCase viewBox", () => {
			const svg =
				'<svg viewbox="0 0 16 16" viewBox="0 0 24 24"><path d="M12 2"/></svg>';
			const { viewBox } = parseSvg(svg);

			assert.equal(viewBox, "0 0 16 16");
		});

		test("handles missing viewBox attribute", () => {
			const svg = '<svg><path d="M12 2"/></svg>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		// ===== PATH PROCESSING TESTS =====
		test("includes paths with no fill attribute", () => {
			const svg = '<svg><path d="M12 2"/></svg>';
			const { path: svgPath } = parseSvg(svg);

			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		test("includes paths with fill attribute other than 'none'", () => {
			const svg = '<svg><path d="M12 2" fill="currentColor"/></svg>';
			const { path: svgPath } = parseSvg(svg);

			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		test("excludes paths with fill='none'", () => {
			const svg = '<svg><path d="M12 2" fill="none"/></svg>';
			const { path: svgPath } = parseSvg(svg);

			assert.equal(svgPath.length, 0);
		});

		test("excludes paths with empty d attribute", () => {
			const svg = '<svg><path d=""/></svg>';
			const { path: svgPath } = parseSvg(svg);

			assert.equal(svgPath.length, 0);
		});

		test("excludes paths with missing d attribute", () => {
			const svg = '<svg><path fill="currentColor"/></svg>';
			const { path: svgPath } = parseSvg(svg);

			assert.equal(svgPath.length, 0);
		});

		test("handles multiple paths with mixed fill values", () => {
			const svg = `
        <svg viewBox="0 0 24 24">
          <path d="M12 2" fill="currentColor"/>
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M6 6"/>
          <path d="M8 8" fill="red"/>
        </svg>
      `;
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 3);
			assert.equal(svgPath[0], "M12 2");
			assert.equal(svgPath[1], "M6 6");
			assert.equal(svgPath[2], "M8 8");
		});

		// ===== EDGE CASES =====
		test("handles SVG with no paths", () => {
			const svg = '<svg viewBox="0 0 24 24"></svg>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 0);
		});

		test("handles empty SVG", () => {
			const svg = "";
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "");
			assert.equal(svgPath.length, 0);
		});

		test("handles SVG with whitespace and newlines", () => {
			const svg = `
        <svg 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            fill="currentColor"
          />
        </svg>
      `;
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(
				svgPath[0],
				"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
			);
		});

		test("handles SVG with other elements (ignores them)", () => {
			const svg = `
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2"/>
          <rect x="2" y="2" width="20" height="20"/>
        </svg>
      `;
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		test("handles SVG with namespace", () => {
			const svg =
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2"/></svg>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		test("handles SVG with mixed case element names (sax parser behavior)", () => {
			const svg = '<SVG viewBox="0 0 24 24"><PATH d="M12 2"/></SVG>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			// sax parser with lowercase: true doesn't handle mixed case well
			// This is expected behavior - sax parser expects lowercase element names
			assert.equal(viewBox, "");
			assert.equal(svgPath.length, 0);
		});

		test("handles complex path data", () => {
			const complexPath =
				"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
			const svg = `<svg viewBox="0 0 24 24"><path d="${complexPath}"/></svg>`;
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], complexPath);
		});

		test("handles SVG with self-closing tags", () => {
			const svg = '<svg viewBox="0 0 24 24"><path d="M12 2"/></svg>';
			const { viewBox, path: svgPath } = parseSvg(svg);

			assert.equal(viewBox, "0 0 24 24");
			assert.equal(svgPath.length, 1);
			assert.equal(svgPath[0], "M12 2");
		});

		// ===== ERROR HANDLING TESTS =====
		test("throws error on malformed XML", () => {
			const svg = '<svg><path d="M12 2"></svg>'; // Missing closing tag

			assert.throws(() => {
				parseSvg(svg);
			}, /SVG parsing error/);
		});

		test("throws error on invalid XML", () => {
			const svg = '<svg><path d="M12 2" fill="currentColor"</svg>'; // Missing closing quote

			assert.throws(() => {
				parseSvg(svg);
			}, /SVG parsing error/);
		});
	});

	suite("Smoke Tests", () => {
		test("parses check.svg from assets", async () => {
			const svgData = await readFile(
				path.join(ASSETS_DIR, "check.svg"),
				"utf-8",
			);
			const { viewBox, path: svgPath } = parseSvg(svgData);

			assert.equal(viewBox, "0 0 24 24");
			assert.ok(svgPath.length > 0, "Should have at least one path");

			const firstPath = svgPath[0];
			assert.ok(
				firstPath && firstPath.length > 0,
				"Path data should not be empty",
			);
		});

		test("parses home.svg from assets", async () => {
			const svgData = await readFile(
				path.join(ASSETS_DIR, "home.svg"),
				"utf-8",
			);
			const { viewBox, path: svgPath } = parseSvg(svgData);

			// This SVG uses a different coordinate system
			assert.equal(viewBox, "0 -960 960 960");
			assert.ok(svgPath.length > 0, "Should have at least one path");
			const firstPath = svgPath[0];
			assert.ok(
				firstPath && firstPath.length > 0,
				"Path data should not be empty",
			);
		});

		test("parses settings.svg from assets", async () => {
			const svgData = await readFile(
				path.join(ASSETS_DIR, "settings.svg"),
				"utf-8",
			);
			const { viewBox, path: svgPath } = parseSvg(svgData);

			// This SVG uses a different coordinate system
			assert.equal(viewBox, "0 -960 960 960");
			assert.ok(svgPath.length > 0, "Should have at least one path");
			const firstPath = svgPath[0];
			assert.ok(
				firstPath && firstPath.length > 0,
				"Path data should not be empty",
			);
		});

		test("parses user.svg from assets", async () => {
			const svgData = await readFile(
				path.join(ASSETS_DIR, "user.svg"),
				"utf-8",
			);
			const { viewBox, path: svgPath } = parseSvg(svgData);

			assert.equal(viewBox, "0 0 24 24");
			assert.ok(svgPath.length > 0, "Should have at least one path");
			const firstPath = svgPath[0];
			assert.ok(
				firstPath && firstPath.length > 0,
				"Path data should not be empty",
			);
		});

		test("handles assets with fill='none' paths", async () => {
			// Test an asset that likely has invisible paths (like add.svg)
			const svgData = await readFile(path.join(ASSETS_DIR, "add.svg"), "utf-8");
			const result = parseSvg(svgData);

			// add.svg has 2 paths: one visible, one with fill="none"
			// Our parser should only return the visible one
			assert.equal(result.path.length, 1, "Should only return visible paths");
			assert.equal(result.path[0], "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
		});
	});
});
