import { BaseBreakpoints, baseBreakpoints } from './base.js'
import { SemanticBreakpoints, semanticBreakpoints } from './semantic.js'

type Breakpoint = {
  base: BaseBreakpoints
  semantic: SemanticBreakpoints
}

export default () =>
  ({
    base: baseBreakpoints,
    semantic: semanticBreakpoints,
  }) satisfies Breakpoint
