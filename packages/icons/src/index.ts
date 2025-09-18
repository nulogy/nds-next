// Export the static IconData type
export type { IconData } from "./types.d.ts";

// Export the parseSvg function
export { default as parseSvg } from "./parseSvg.js";

// Export the type generation functions for build tools
export { generateIconTypeDeclarations, writeTypeDeclarations } from "./generateTypes.js";
