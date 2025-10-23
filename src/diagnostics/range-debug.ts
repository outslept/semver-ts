import type { ParseRange } from '../range/parse'

export type RangeDebugReason = 'INVALID_RANGE'

export type ParseRangeDebug<R extends string> =
  ParseRange<R> extends infer AST
    ? ([AST] extends [never] ? { ok: false; reason: 'INVALID_RANGE' } : { ok: true; value: AST })
    : never
