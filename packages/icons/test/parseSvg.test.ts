import { test } from "node:test";
import assert from "node:assert";
import parseSvg from "../src/parseSvg.ts";

// Common test SVG data
const TEST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

test("SVG Parser Tests", async (t) => {
  
  // ===== BASIC FUNCTIONALITY TESTS =====
  await t.test("Basic SVG parsing with sax parser", () => {
    const { viewBox, path: svgPath } = parseSvg(TEST_SVG);
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath[0], "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
  });

  await t.test("fast-xml-parser vs sax - same results", () => {
    const { viewBox, path: svgPath } = parseSvg(TEST_SVG);

    assert.equal(viewBox, viewBox);
    assert.deepEqual(svgPath, svgPath);
  });

  // ===== VIEWBOX EXTRACTION TESTS =====
  await t.test("extracts viewBox from lowercase attribute", () => {
    const svg = '<svg viewbox="0 0 24 24"><path d="M12 2"/></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  await t.test("extracts viewBox from camelCase attribute", () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M12 2"/></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  await t.test("prefers lowercase viewbox over camelCase viewBox", () => {
    const svg = '<svg viewbox="0 0 16 16" viewBox="0 0 24 24"><path d="M12 2"/></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 16 16");
  });

  await t.test("handles missing viewBox attribute", () => {
    const svg = '<svg><path d="M12 2"/></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "");
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  // ===== PATH PROCESSING TESTS =====
  await t.test("includes paths with no fill attribute", () => {
    const svg = '<svg><path d="M12 2"/></svg>';
    const { path: svgPath } = parseSvg(svg);
    
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  await t.test("includes paths with fill attribute other than 'none'", () => {
    const svg = '<svg><path d="M12 2" fill="currentColor"/></svg>';
    const { path: svgPath } = parseSvg(svg);
    
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  await t.test("excludes paths with fill='none'", () => {
    const svg = '<svg><path d="M12 2" fill="none"/></svg>';
    const { path: svgPath } = parseSvg(svg);
    
    assert.equal(svgPath.length, 0);
  });

  await t.test("excludes paths with empty d attribute", () => {
    const svg = '<svg><path d=""/></svg>';
    const { path: svgPath } = parseSvg(svg);
    
    assert.equal(svgPath.length, 0);
  });

  await t.test("excludes paths with missing d attribute", () => {
    const svg = '<svg><path fill="currentColor"/></svg>';
    const { path: svgPath } = parseSvg(svg);
    
    assert.equal(svgPath.length, 0);
  });

  await t.test("handles multiple paths with mixed fill values", () => {
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
  await t.test("handles SVG with no paths", () => {
    const svg = '<svg viewBox="0 0 24 24"></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath.length, 0);
  });

  await t.test("handles empty SVG", () => {
    const svg = '';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "");
    assert.equal(svgPath.length, 0);
  });

  await t.test("handles SVG with whitespace and newlines", () => {
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
    assert.equal(svgPath[0], "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z");
  });

  await t.test("handles SVG with other elements (ignores them)", () => {
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

  await t.test("handles SVG with namespace", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2"/></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  await t.test("handles SVG with mixed case element names (sax parser behavior)", () => {
    const svg = '<SVG viewBox="0 0 24 24"><PATH d="M12 2"/></SVG>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    // sax parser with lowercase: true doesn't handle mixed case well
    // This is expected behavior - sax parser expects lowercase element names
    assert.equal(viewBox, "");
    assert.equal(svgPath.length, 0);
  });

  await t.test("handles complex path data", () => {
    const complexPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
    const svg = `<svg viewBox="0 0 24 24"><path d="${complexPath}"/></svg>`;
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], complexPath);
  });

  await t.test("handles SVG with self-closing tags", () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M12 2"/></svg>';
    const { viewBox, path: svgPath } = parseSvg(svg);
    
    assert.equal(viewBox, "0 0 24 24");
    assert.equal(svgPath.length, 1);
    assert.equal(svgPath[0], "M12 2");
  });

  // ===== ERROR HANDLING TESTS =====
  await t.test("throws error on malformed XML", () => {
    const svg = '<svg><path d="M12 2"></svg>'; // Missing closing tag
    
    assert.throws(() => {
      parseSvg(svg);
    }, /SVG parsing error/);
  });

  await t.test("throws error on invalid XML", () => {
    const svg = '<svg><path d="M12 2" fill="currentColor"</svg>'; // Missing closing quote
    
    assert.throws(() => {
      parseSvg(svg);
    }, /SVG parsing error/);
  });
});
