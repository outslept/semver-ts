import type { CmpBuild, CmpSemver, EqSemver } from "../comparator.js";
import type { Satisfies } from "./eval.js";

type InsertAsc<V extends string, L extends string[]> = L extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? CmpBuild<V, H> extends -1
    ? [V, H, ...T]
    : [H, ...InsertAsc<V, T>]
  : [V];

type SortAsc<Vs extends string[], Acc extends string[] = []> = Vs extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? SortAsc<T, InsertAsc<H, Acc>>
  : Acc;

type InsertDesc<V extends string, L extends string[]> = L extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? CmpBuild<V, H> extends 1
    ? [V, H, ...T]
    : [H, ...InsertDesc<V, T>]
  : [V];

type SortDesc<Vs extends string[], Acc extends string[] = []> = Vs extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? SortDesc<T, InsertDesc<H, Acc>>
  : Acc;

export type Sort<Vs extends string[]> = SortAsc<Vs>;
export type RSort<Vs extends string[]> = SortDesc<Vs>;

type Contains<Vs extends string[], V extends string> = Vs extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? EqSemver<H, V> extends true
    ? true
    : Contains<T, V>
  : false;

type UniqueAcc<Vs extends string[], Acc extends string[] = []> = Vs extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? Contains<Acc, H> extends true
    ? UniqueAcc<T, Acc>
    : UniqueAcc<T, [...Acc, H]>
  : Acc;

export type Unique<Vs extends string[]> = UniqueAcc<Vs>;

type FilterSatisfying<
  Vs extends string[],
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> = Vs extends [infer H extends string, ...infer T extends string[]]
  ? Satisfies<H, R, O> extends true
    ? [H, ...FilterSatisfying<T, R, O>]
    : FilterSatisfying<T, R, O>
  : [];

type MaxOf<Vs extends string[], Best extends string | null = null> = Vs extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? Best extends string
    ? CmpSemver<H, Best> extends 1
      ? MaxOf<T, H>
      : MaxOf<T, Best>
    : MaxOf<T, H>
  : Best extends string
    ? Best
    : never;

type MinOf<Vs extends string[], Best extends string | null = null> = Vs extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? Best extends string
    ? CmpSemver<H, Best> extends -1
      ? MinOf<T, H>
      : MinOf<T, Best>
    : MinOf<T, H>
  : Best extends string
    ? Best
    : never;

export type MaxSatisfying<
  Vs extends string[],
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> = MaxOf<FilterSatisfying<Vs, R, O>>;

export type MinSatisfying<
  Vs extends string[],
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> = MinOf<FilterSatisfying<Vs, R, O>>;

export type SimplifyRange<
  Vs extends string[],
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> =
  Sort<FilterSatisfying<Vs, R, O>> extends infer Sorted extends string[]
    ? Sorted extends []
      ? ""
      : Sorted extends [infer Only extends string]
        ? Only
        : Sorted extends [infer First extends string, ...any[], infer Last extends string]
          ? `${First} - ${Last}`
          : never
    : never;
