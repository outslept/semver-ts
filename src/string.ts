import type { IsDigit, IsAlphaNumDash } from './char'

export type IsDigits<S extends string> =
  S extends `${infer C}${infer R}` ? (IsDigit<C> extends true ? IsDigits<R> : false) : true

export type IsNonEmpty<S extends string> =
    S extends '' ? false : true

export type StartsWithZero<S extends string> =
    S extends `0${string}` ? true : false

export type NoLeadingZero<S extends string> =
    S extends '0' ? true : (StartsWithZero<S> extends true ? false : true)

export type IsNumericId<S extends string> =
    IsNonEmpty<S> extends true
      ? (IsDigits<S> extends true ? NoLeadingZero<S> : false)
      : false

export type AllAlphaNumDash<S extends string> =
  S extends `${infer C}${infer R}` ? (IsAlphaNumDash<C> extends true ? AllAlphaNumDash<R> : false) : true

export type IsAlphaNumDashToken<S extends string> =
  IsNonEmpty<S> extends true ? (AllAlphaNumDash<S> extends true ? true : false) : false

export type SplitDotsNonEmpty<S extends string> =
  S extends '' ? never :
    S extends `${infer H}.${infer T}` ? (
      H extends '' ? never :
        SplitDotsNonEmpty<T> extends infer R ? (R extends string[] ? [H, ...R] : never) : never
    ) : (S extends '' ? never : [S])
