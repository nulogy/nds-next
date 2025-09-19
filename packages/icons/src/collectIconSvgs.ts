import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import parseSvg from "./parseSvg.js";
import type { IconData } from "./types.d.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, "..", "assets", "icons.json");
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

const iconData: Record<string, IconData> = {};

icons.forEach(({ svg, name }) => {
	const { path, viewBox } = parseSvg(svg);
	iconData[name] = { path, viewBox };
});

const json = JSON.stringify(iconData, null, "  ");
fs.writeFileSync(jsonPath, json);
