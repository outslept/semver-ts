import type { Digit } from './char'
import type { ParseSemver, PreId } from './parser'

export type Eq<A, B> =
      (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false

type SuccDigit<D extends Digit> =
      D extends '0' ? '1' : D extends '1' ? '2' : D extends '2' ? '3' : D extends '3' ? '4' :
        D extends '4' ? '5' : D extends '5' ? '6' : D extends '6' ? '7' : D extends '7' ? '8' :
          D extends '8' ? '9' : '0'

export type IncNumStrCarry<S extends string> =
      S extends '' ? '1' :
        S extends `${infer R}${infer D extends Digit}`
          ? (D extends '9' ? `${IncNumStrCarry<R>}0` : `${R}${SuccDigit<D>}`)
          : never

export type IncNumStr<S extends string> =
      S extends `${infer R}${infer D extends Digit}`
        ? (D extends '9' ? `${IncNumStrCarry<R>}0` : `${R}${SuccDigit<D>}`)
        : never

export type NextPatch<V extends string> =
      ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string; patch: infer C extends string }
        ? `${A}.${B}.${IncNumStr<C>}`
        : never

export type NextMinor<V extends string> =
      ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string }
        ? `${A}.${IncNumStr<B>}.0`
        : never

export type NextMajor<V extends string> =
      ParseSemver<V> extends { major: infer A extends string }
        ? `${IncNumStr<A>}.0.0`
        : never

type PopLast<A extends any[]> = A extends [...infer I, infer L] ? [I, L] : [[], never]

type FirstIsTag<Ps extends PreId[], Tag extends string> =
      Ps extends [infer H extends PreId, ...any[]]
        ? (H extends { kind: 'str'; v: infer S extends string } ? (Eq<S, Tag> extends true ? true : false) : false)
        : false

type PreIdsToStr<Ps extends PreId[]> =
      Ps extends [infer H extends PreId, ...infer T extends PreId[]]
        ? (T extends [] ? `${H['v']}` : `${H['v']}.${PreIdsToStr<T>}`)
        : ''

type NextPreTokens<Ps extends PreId[], Tag extends string> =
      FirstIsTag<Ps, Tag> extends true
        ? (PopLast<Ps> extends [infer Init extends PreId[], infer Last extends PreId]
            ? (Last extends { kind: 'num'; v: infer NV extends string }
                ? [...Init, { kind: 'num'; v: IncNumStr<NV> }]
                : [...Ps, { kind: 'num'; v: '1' }])
            : [ { kind: 'str'; v: Tag }, { kind: 'num'; v: '1' } ])
        : [ { kind: 'str'; v: Tag }, { kind: 'num'; v: '1' } ]

export type NextPre<V extends string, Tag extends string> =
              ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string; patch: infer C extends string; pre: infer P extends PreId[] }
                ? NextPreTokens<P, Tag> extends infer OUT extends PreId[]
                  ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
                  : never
                : never
