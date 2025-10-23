import type { PreId } from '../parser'
import type { Eq } from '../utils/eq'
import type { IncNumStr } from './num'

export type PopLast<A extends any[]> = A extends [...infer I, infer L] ? [I, L] : [[], never]

export type FirstIsTag<Ps extends PreId[], Tag extends string> =
  Ps extends [infer H extends PreId, ...any[]]
    ? (H extends { kind: 'str'; v: infer S extends string } ? (Eq<S, Tag> extends true ? true : false) : false)
    : false

export type PreIdsToStr<Ps extends PreId[]> =
  Ps extends [infer H extends PreId, ...infer T extends PreId[]]
    ? (T extends [] ? `${H['v']}` : `${H['v']}.${PreIdsToStr<T>}`)
    : ''

export type NextPreTokens<Ps extends PreId[], Tag extends string> =
  FirstIsTag<Ps, Tag> extends true
    ? (PopLast<Ps> extends [infer Init extends PreId[], infer Last extends PreId]
        ? (Last extends { kind: 'num'; v: infer NV extends string }
            ? [...Init, { kind: 'num'; v: IncNumStr<NV> }]
            : [...Ps, { kind: 'num'; v: '1' }])
        : [ { kind: 'str'; v: Tag }, { kind: 'num'; v: '1' } ])
    : [ { kind: 'str'; v: Tag }, { kind: 'num'; v: '1' } ]
