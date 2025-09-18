import { test, suite } from "node:test";
import assert from "node:assert";
import { generateIconTypeDeclarations } from "../src/generateTypes.ts";

suite("generateIconTypeDeclarations", () => {
  suite("Basic Functionality", () => {
    test("generates type declarations for empty array", () => {
      const result = generateIconTypeDeclarations([]);
      
      assert.ok(result.includes('declare module "@nulogy/icons"'));
      assert.ok(result.includes('export type { IconData } from "./types.d.ts"'));
      assert.ok(result.includes('export type IconName = '));
      assert.ok(result.includes('const icons: { [K in IconName]: IconData }'));
      assert.ok(result.includes('export default icons'));
    });

    test("generates type declarations for single icon", () => {
      const iconNames = ["home"];
      const result = generateIconTypeDeclarations(iconNames);
      
      assert.ok(result.includes('export type IconName = "home"'));
    });

    test("generates type declarations for multiple icons", () => {
      const iconNames = ["home", "user", "settings"];
      const result = generateIconTypeDeclarations(iconNames);
      
      assert.ok(result.includes('export type IconName = "home" | "user" | "settings"'));
    });

    test("generates type declarations for many icons", () => {
      const iconNames = ["home", "user", "settings", "search", "menu", "close", "edit", "delete"];
      const result = generateIconTypeDeclarations(iconNames);
      
      const expectedType = '"home" | "user" | "settings" | "search" | "menu" | "close" | "edit" | "delete"';
      assert.ok(result.includes(`export type IconName = ${expectedType}`));
    });
  });

  suite("Edge Cases", () => {
    test("handles icon names with special characters", () => {
      const iconNames = ["icon-name", "icon_name", "icon.name"];
      const result = generateIconTypeDeclarations(iconNames);
      
      assert.ok(result.includes('"icon-name" | "icon_name" | "icon.name"'));
    });

    test("handles icon names with numbers", () => {
      const iconNames = ["icon1", "icon2", "icon-3"];
      const result = generateIconTypeDeclarations(iconNames);
      
      assert.ok(result.includes('"icon1" | "icon2" | "icon-3"'));
    });

    test("handles duplicate icon names", () => {
      const iconNames = ["home", "home", "user"];
      const result = generateIconTypeDeclarations(iconNames);
      
      // Should include duplicates as they appear in the input
      assert.ok(result.includes('"home" | "home" | "user"'));
    });

    test("handles very long icon names", () => {
      const longName = "very-long-icon-name-with-many-characters-and-descriptive-text";
      const iconNames = [longName];
      const result = generateIconTypeDeclarations(iconNames);
      
      assert.ok(result.includes(`"${longName}"`));
    });
  });

  suite("Output Structure", () => {
    test("includes proper module declaration", () => {
      const result = generateIconTypeDeclarations(["test"]);
      
      assert.ok(result.includes('declare module "@nulogy/icons" {'));
      assert.ok(result.includes('}'));
    });

    test("includes IconData type reference", () => {
      const result = generateIconTypeDeclarations(["test"]);
      
      assert.ok(result.includes('export type { IconData } from "./types.d.ts"'));
    });

    test("includes IconName type", () => {
      const result = generateIconTypeDeclarations(["test"]);
      
      assert.ok(result.includes('export type IconName ='));
    });

    test("includes icons constant declaration", () => {
      const result = generateIconTypeDeclarations(["test"]);
      
      assert.ok(result.includes('const icons: { [K in IconName]: IconData };'));
    });

    test("includes default export", () => {
      const result = generateIconTypeDeclarations(["test"]);
      
      assert.ok(result.includes('export default icons;'));
    });

    test("maintains proper indentation", () => {
      const result = generateIconTypeDeclarations(["test"]);
      const lines = result.split('\n');
      
      // Check that the module declaration is properly indented
      const moduleLine = lines.find(line => line.includes('declare module'));
      assert.ok(moduleLine && moduleLine.startsWith('declare module'));
      
      // Check that type reference is indented
      const typeRefLine = lines.find(line => line.includes('export type { IconData }'));
      assert.ok(typeRefLine && typeRefLine.startsWith('  export type { IconData }'));
      
      // Check that IconName type is indented
      const iconNameLine = lines.find(line => line.includes('export type IconName'));
      assert.ok(iconNameLine && iconNameLine.startsWith('  export type IconName'));
    });
  });

  suite("Type Safety", () => {
    test("generates valid TypeScript syntax", () => {
      const iconNames = ["home", "user", "settings"];
      const result = generateIconTypeDeclarations(iconNames);
      
      // Basic syntax checks
      assert.ok(result.includes('declare module'));
      assert.ok(result.includes('export type { IconData }'));
      assert.ok(result.includes('export type IconName'));
      assert.ok(result.includes('const icons'));
      assert.ok(result.includes('export default'));
      
      // Check for proper union type syntax
      assert.ok(result.includes('"home" | "user" | "settings"'));
    });

    test("handles empty string icon names", () => {
      const iconNames = [""];
      const result = generateIconTypeDeclarations(iconNames);
      
      assert.ok(result.includes('export type IconName = ""'));
    });

    test("preserves exact icon names", () => {
      const iconNames = ["Home", "USER", "Settings"];
      const result = generateIconTypeDeclarations(iconNames);
      
      // Should preserve case exactly as provided
      assert.ok(result.includes('"Home" | "USER" | "Settings"'));
    });
  });
});
