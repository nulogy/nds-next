import { baseColors, BaseColors } from './base.js'
import { categoricalColors, CategoricalColors } from './categorical.js'

interface Colors {
  base: BaseColors
  categorical: CategoricalColors
}

export default () =>
  ({
    base: baseColors,
    categorical: categoricalColors,
  }) satisfies Colors
