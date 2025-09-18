import fs from "fs";
import path from "path";
import parseSvg from "./parseSvg.ts";

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

const iconData = {};

icons.forEach(({ svg, name }) => {
  const { path, viewBox } = parseSvg(svg);
  iconData[name] = { path, viewBox };
});

const json = JSON.stringify(iconData, null, "  ");
fs.writeFileSync(jsonPath, json);