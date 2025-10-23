import type { PreId } from '../parser'
import type { Eq } from '../increment'

export type EqStr<A extends string, B extends string> = Eq<A, B>

export type EqStrArr<A extends string[], B extends string[]> =
  A extends [infer HA extends string, ...infer TA extends string[]]
    ? (B extends [infer HB extends string, ...infer TB extends string[]]
        ? (EqStr<HA, HB> extends true ? EqStrArr<TA, TB> : false)
        : false)
    : (B extends [] ? true : false)

export type EqPreId<A extends PreId, B extends PreId> =
  Eq<A['kind'], B['kind']> extends true ? EqStr<A['v'], B['v']> : false

export type EqPreArr<A extends PreId[], B extends PreId[]> =
  A extends [infer HA extends PreId, ...infer TA extends PreId[]]
    ? (B extends [infer HB extends PreId, ...infer TB extends PreId[]]
        ? (EqPreId<HA, HB> extends true ? EqPreArr<TA, TB> : false)
        : false)
    : (B extends [] ? true : false)
