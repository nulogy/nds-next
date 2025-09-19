import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import parseSvg from "./parseSvg.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsPath = path.join(__dirname, "icons.ts");
const svgPath = path.join(__dirname, "..", "assets");

const icons = fs
	.readdirSync(svgPath)
	.filter((file) => /\.svg$/.test(file))
	.map((file) => {
		const name = file.replace(".svg", "");
		const svg = fs.readFileSync(`${svgPath}/${file}`, "utf8").toString();
		return {
			name,
			svg,
		};
	});

const iconData: Record<string, { path: string[]; viewBox: string }> = {};

icons.forEach(({ svg, name }) => {
	const { path, viewBox } = parseSvg(svg);
	iconData[name] = { path, viewBox };
});

// Generate TypeScript code
const tsContent = `// Auto-generated file - do not edit manually
export const icons = ${JSON.stringify(iconData, null, 2)} as const;

export type IconName = keyof typeof icons;
`;

fs.writeFileSync(iconsPath, tsContent);

console.log(`Generated icons.ts with ${Object.keys(iconData).length} icons 🎉`);
