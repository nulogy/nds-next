// Export the static IconData type
export interface IconData {
  path: string[];
  viewBox: string;
}

// Export the parseSvg function
export { default as parseSvg } from "./parseSvg.js";

// Export icons data and types
export { icons, type IconName } from "./icons.js";
export { icons as default } from "./icons.js";
