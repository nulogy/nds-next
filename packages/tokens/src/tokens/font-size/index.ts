import {
	type ExperimentalFontSize,
	experimentalFontSizes,
} from "./experimental.js";
import { type SemanticFontSize, semanticFontSizes } from "./semantic.js";
import { type StandardFontSize, standardFontSize } from "./standard.js";

interface FontSize {
	standard: Record<StandardFontSize, string>;
	experimental: Record<ExperimentalFontSize, string>;
	semantic: Record<SemanticFontSize, string>;
}

export default (baseUnit: number) =>
	({
		standard: standardFontSize(baseUnit),
		experimental: experimentalFontSizes(baseUnit),
		semantic: semanticFontSizes(baseUnit),
	}) satisfies FontSize;
