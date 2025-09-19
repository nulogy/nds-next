import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, "..", "assets");
const TYPES_FILE = path.join(__dirname, "index.d.ts");

/**
 * Generates TypeScript type declarations for icon names.
 * This function is pure and testable - it only generates the type content.
 *
 * @param iconNames - Array of icon names (without .svg extension)
 * @returns The TypeScript declaration content as a string
 */
export function generateIconTypeDeclarations(iconNames: string[]): string {
	return `declare module "@nulogy/icons" {
  export type { IconData } from "./types.d.ts";

  export type IconName = ${iconNames.map((name) => `"${name}"`).join(" | ")};

  const icons: { [K in IconName]: IconData };

  export default icons;
}`;
}

/**
 * Writes the generated type declarations to a file.
 *
 * @param content - The TypeScript declaration content to write
 * @param outputPath - The file path where to write the declarations
 */
export function writeTypeDeclarations(
	content: string,
	outputPath: string,
): void {
	fs.writeFileSync(outputPath, content);
}

/**
 * Reads icon names from the assets directory.
 *
 * @param assetsDir - Path to the assets directory (optional, defaults to relative path)
 * @returns Array of icon names (without .svg extension)
 */
export function readIconNames(assetsDir: string = ASSETS_DIR): string[] {
	return fs
		.readdirSync(assetsDir)
		.filter((file) => file.endsWith(".svg"))
		.map((file) => file.replace(".svg", ""));
}

/**
 * Main function that orchestrates the type generation process.
 * Reads icon names from the assets directory and generates type declarations.
 *
 * @param assetsDir - Path to the assets directory (optional, defaults to relative path)
 * @param outputPath - Path where to write the type declarations (optional, defaults to src/index.d.ts)
 */
export function generateIconTypes(
	assetsDir: string = ASSETS_DIR,
	outputPath: string = TYPES_FILE,
): void {
	const iconNames = readIconNames(assetsDir);
	const declarationContent = generateIconTypeDeclarations(iconNames);
	writeTypeDeclarations(declarationContent, outputPath);

	console.log(`Generated types for ${iconNames.length} icons 🎉`);
}
