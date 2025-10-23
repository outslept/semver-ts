import type { CmpNumStr } from '../comparator'
import type { EqStr } from './eq'

export type IsZero<S extends string> = EqStr<S, '0'>
export type NumEq<A extends string, B extends string> = CmpNumStr<A, B> extends 0 ? true : false
