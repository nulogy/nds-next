import fs from "fs";
import path from "path";

const ASSETS_DIR = path.join(__dirname, "..", "assets");
const TYPES_FILE = path.join(__dirname, "index.d.ts");

function generateIconTypes() {
  const iconNames = fs
    .readdirSync(ASSETS_DIR)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(".svg", ""));

  const declarationContent = `declare module "@nulogy/icons" {
  export interface IconData {
    path: string[];
    viewBox: string;
  }

  export type IconName = ${iconNames.map((name) => `"${name}"`).join(" | ")};

  const icons: { [K in IconName]: IconData };

  export default icons;
}`;

  fs.writeFileSync(TYPES_FILE, declarationContent);

  console.log(`Generated types for ${iconNames.length} icons 🎉`);
}

generateIconTypes();