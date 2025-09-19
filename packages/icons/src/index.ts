// Export the static IconData type
export interface IconData {
	path: string[];
	viewBox: string;
}

// Export icons data and types
export { type IconName, icons, icons as default } from "./icons.js";
// Export the parseSvg function
export { default as parseSvg } from "./parseSvg.js";
