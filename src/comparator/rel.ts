import type { CmpSemver } from './semver'

export type Lt<A extends string, B extends string> = CmpSemver<A, B> extends -1 ? true : false
export type Lte<A extends string, B extends string> = CmpSemver<A, B> extends 1 ? false : true
export type Gt<A extends string, B extends string> = CmpSemver<A, B> extends 1 ? true : false
export type Gte<A extends string, B extends string> = CmpSemver<A, B> extends -1 ? false : true
export type EqSemver<A extends string, B extends string> = CmpSemver<A, B> extends 0 ? true : false
