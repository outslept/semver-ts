import type { IsAlphaNumDash } from '../char'
import type { IsNonEmpty } from './nonempty'

export type AllAlphaNumDash<S extends string> =
  S extends `${infer C}${infer R}` ? (IsAlphaNumDash<C> extends true ? AllAlphaNumDash<R> : false) : true

export type IsAlphaNumDashToken<S extends string> =
  IsNonEmpty<S> extends true ? (AllAlphaNumDash<S> extends true ? true : false) : false
