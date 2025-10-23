import type { SplitBy } from '../utils/str'
import type { ComparatorSet, RangeNode, PartialSemver } from './ast'
import type { ParsePartialSemver, ParseComparator } from './comparator'

type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S
type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S
type Trim<S extends string> = TrimLeft<TrimRight<S>>

type FilterEmpty<Ts extends string[], Acc extends string[] = []> =
  Ts extends [infer H extends string, ...infer T extends string[]]
    ? (H extends '' ? FilterEmpty<T, Acc> : FilterEmpty<T, [...Acc, H]>)
    : Acc

type MapComparators<Ts extends string[], Acc extends RangeNode[] = []> =
  Ts extends [infer H extends string, ...infer T extends string[]]
    ? (ParseComparator<H> extends infer N
        ? ([N] extends [never] ? never : MapComparators<T, [...Acc, N & RangeNode]>)
        : never)
    : Acc

type ParseTerm<S extends string> =
  S extends `${infer L} - ${infer R}`
    ? (ParsePartialSemver<Trim<L>> extends infer PL extends PartialSemver
        ? (ParsePartialSemver<Trim<R>> extends infer PR extends PartialSemver
            ? [{ t: 'and'; nodes: [{ t: 'hy'; left: PL; right: PR }] }]
            : never)
        : never)
    : (FilterEmpty<SplitBy<Trim<S>, ' '>> extends infer Ts extends string[]
        ? (MapComparators<Ts> extends infer Ns extends RangeNode[] ? [{ t: 'and'; nodes: Ns }] : never)
        : never)

type MapTerms<Ts extends string[], Acc extends ComparatorSet[] = []> =
  Ts extends [infer H extends string, ...infer T extends string[]]
    ? (ParseTerm<H> extends infer P
        ? (P extends ComparatorSet[] ? MapTerms<T, [...Acc, ...P]> : MapTerms<T, Acc>)
        : never)
    : Acc

export type ParseRange<R extends string> =
  SplitBy<R, '||'> extends infer Parts
    ? (Parts extends string[] ? MapTerms<{ [K in keyof Parts]: Parts[K] extends string ? Trim<Parts[K]> : never } & string[]> : never)
    : never
