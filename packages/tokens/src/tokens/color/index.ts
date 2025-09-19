import { type BaseColors, baseColors } from "./base.js";
import { type CategoricalColors, categoricalColors } from "./categorical.js";

interface Colors {
	base: BaseColors;
	categorical: CategoricalColors;
}

export default () =>
	({
		base: baseColors,
		categorical: categoricalColors,
	}) satisfies Colors;
