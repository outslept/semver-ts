import type { IsValidSemver } from '../parser'
import type { IsDigits, IsNonEmpty } from '../string'
import type { NormalizeSemver } from './format'
import type { StripVPrefix } from './strip-v'

type IsDigitsNonEmpty<S extends string> =
  IsNonEmpty<S> extends true ? (IsDigits<S> extends true ? true : false) : false

type TrimLeadingZeros<S extends string> =
  S extends `0${infer R}` ? TrimLeadingZeros<R> : (S extends '' ? '0' : S)

type StripSuffix<S extends string> =
  S extends `${infer L}-${string}` ? L : (S extends `${infer L2}+${string}` ? L2 : S)

type CoerceLooseFrom<S extends string> =
  S extends `${infer A}.${infer B}.${infer C}.${string}`
    ? (IsDigitsNonEmpty<A> extends true
        ? (IsDigitsNonEmpty<B> extends true
            ? (IsDigitsNonEmpty<C> extends true
                ? `${TrimLeadingZeros<A>}.${TrimLeadingZeros<B>}.${TrimLeadingZeros<C>}`
                : never)
            : never)
        : never)
    : (S extends `${infer A}.${infer B}`
        ? (IsDigitsNonEmpty<A> extends true
            ? (IsDigitsNonEmpty<B> extends true
                ? `${TrimLeadingZeros<A>}.${TrimLeadingZeros<B>}.0`
                : never)
            : never)
        : (IsDigitsNonEmpty<S> extends true
            ? `${TrimLeadingZeros<S>}.0.0`
            : never))

export type CoerceLoose<S extends string> = CoerceLooseFrom<StripSuffix<StripVPrefix<S>>>

export type CoerceSemver<S extends string, Mode extends 'strict' | 'loose' = 'strict'> =
  Mode extends 'strict'
    ? (IsValidSemver<S> extends true ? NormalizeSemver<S> : never)
    : CoerceLoose<S>
