import type { PreIdsToStr } from "../increment/pre-internals.js";
import type { IncNumStr } from "../increment/num.js";
import type { ParseSemver, PreId } from "../parser.js";
import type { NormalizeRange, NormCmp, NormRange, NormSet } from "./expand.js";
import type { CmpSemver } from "../comparator.js";
import type { And } from "../utils.js";
import type { ParseRange } from "./parse.js";

type OptInclude<O> = O extends { includePrerelease: infer B extends boolean } ? B : false;

type IsPrerelease<V extends string> =
  ParseSemver<V> extends { pre: infer P extends PreId[] } ? (P extends [] ? false : true) : false;

type CoreOf<V extends string> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
  }
    ? `${A}.${B}.${C}`
    : never;

type CoreOfStr<S extends string> =
  ParseSemver<S> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
  }
    ? `${A}.${B}.${C}`
    : never;

type MentionsCore<C extends NormCmp, K extends string> =
  ParseSemver<C["v"]> extends { pre: infer P extends PreId[] }
    ? P extends []
      ? false
      : CoreOfStr<C["v"]> extends K
        ? true
        : false
    : false;

type SetMentionsCore<S extends NormSet, K extends string> = S extends [
  infer H extends NormCmp,
  ...infer T extends NormCmp[],
]
  ? MentionsCore<H, K> extends true
    ? true
    : SetMentionsCore<T, K>
  : false;

type CmpToBool<C extends -1 | 0 | 1, OP extends "=" | ">" | ">=" | "<" | "<="> = OP extends "="
  ? C extends 0
    ? true
    : false
  : OP extends ">"
    ? C extends 1
      ? true
      : false
    : OP extends ">="
      ? C extends -1
        ? false
        : true
      : OP extends "<"
        ? C extends -1
          ? true
          : false
        : OP extends "<="
          ? C extends 1
            ? false
            : true
          : false;

type SatisfiesCmp<V extends string, C extends NormCmp> =
  CmpSemver<V, C["v"]> extends infer R extends -1 | 0 | 1 ? CmpToBool<R, C["op"]> : never;

type SatisfiesSetRaw<V extends string, S extends NormSet> = S extends [
  infer H extends NormCmp,
  ...infer T extends NormCmp[],
]
  ? SatisfiesCmp<V, H> extends true
    ? SatisfiesSetRaw<V, T>
    : false
  : true;

type SatisfiesSet<
  V extends string,
  S extends NormSet,
  Include extends boolean,
> = Include extends true
  ? SatisfiesSetRaw<V, S>
  : IsPrerelease<V> extends true
    ? And<SatisfiesSetRaw<V, S>, SetMentionsCore<S, CoreOf<V>>>
    : SatisfiesSetRaw<V, S>;

type SatisfiesAny<V extends string, R extends NormRange, Include extends boolean> = R extends [
  infer H extends NormSet,
  ...infer T extends NormSet[],
]
  ? SatisfiesSet<V, H, Include> extends true
    ? true
    : SatisfiesAny<V, T, Include>
  : false;

export type Satisfies<
  V extends string,
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> =
  ParseRange<R> extends infer AST
    ? NormalizeRange<AST & any> extends infer NR extends NormRange
      ? SatisfiesAny<V, NR, OptInclude<O>>
      : never
    : never;

type LB = { kind: "lb"; v: string; strict: boolean };
type UB = { kind: "ub"; v: string; strict: boolean };
type UBNone = { kind: "ubnone" };

type MaxLB<A extends LB, B extends LB> =
  CmpSemver<A["v"], B["v"]> extends infer C extends -1 | 0 | 1
    ? C extends -1
      ? B
      : C extends 1
        ? A
        : {
            kind: "lb";
            v: A["v"];
            strict: A["strict"] extends true ? true : B["strict"] extends true ? true : false;
          }
    : never;

type MinUB<A extends UB | UBNone, B extends UB | UBNone> = [A] extends [UBNone]
  ? B
  : [B] extends [UBNone]
    ? A
    : A extends UB
      ? B extends UB
        ? CmpSemver<A["v"], B["v"]> extends infer C extends -1 | 0 | 1
          ? C extends -1
            ? A
            : C extends 1
              ? B
              : {
                  kind: "ub";
                  v: A["v"];
                  strict: A["strict"] extends true ? true : B["strict"] extends true ? true : false;
                }
          : never
        : never
      : never;

type FoldBounds<
  S extends NormSet,
  L extends LB = { kind: "lb"; v: "0.0.0"; strict: false },
  U extends UB | UBNone = UBNone,
  EqV extends string | null = null,
> = S extends [infer H extends NormCmp, ...infer T extends NormCmp[]]
  ? H["op"] extends ">="
    ? FoldBounds<T, MaxLB<L, { kind: "lb"; v: H["v"]; strict: false }>, U, EqV>
    : H["op"] extends ">"
      ? FoldBounds<T, MaxLB<L, { kind: "lb"; v: H["v"]; strict: true }>, U, EqV>
      : H["op"] extends "<="
        ? FoldBounds<T, L, MinUB<U, { kind: "ub"; v: H["v"]; strict: false }>, EqV>
        : H["op"] extends "<"
          ? FoldBounds<T, L, MinUB<U, { kind: "ub"; v: H["v"]; strict: true }>, EqV>
          : H["op"] extends "="
            ? FoldBounds<
                T,
                L,
                U,
                EqV extends string ? (CmpSemver<EqV, H["v"]> extends 0 ? EqV : H["v"]) : H["v"]
              >
            : never
  : { lb: L; ub: U; eq: EqV };

type IntervalsIntersect<
  B1 extends { lb: LB; ub: UB | UBNone },
  B2 extends { lb: LB; ub: UB | UBNone },
> =
  MaxLB<B1["lb"], B2["lb"]> extends infer LBX extends LB
    ? MinUB<B1["ub"], B2["ub"]> extends infer UBY extends UB | UBNone
      ? [UBY] extends [UBNone]
        ? true
        : UBY extends UB
          ? CmpSemver<LBX["v"], UBY["v"]> extends infer C extends -1 | 0 | 1
            ? C extends -1
              ? true
              : C extends 1
                ? false
                : LBX["strict"] extends true
                  ? false
                  : UBY["strict"] extends true
                    ? false
                    : true
            : never
          : never
      : never
    : never;

type IntersectsSetPair<S1 extends NormSet, S2 extends NormSet> =
  FoldBounds<S1> extends infer B1
    ? B1 extends { lb: LB; ub: UB | UBNone; eq: infer E1 }
      ? E1 extends string
        ? SatisfiesSetRaw<E1, S2> extends true
          ? true
          : false
        : FoldBounds<S2> extends infer B2
          ? B2 extends { lb: LB; ub: UB | UBNone; eq: infer E2 }
            ? E2 extends string
              ? SatisfiesSetRaw<E2, S1> extends true
                ? true
                : false
              : IntervalsIntersect<B1, B2>
            : never
          : never
      : never
    : never;

type IntersectsAny<S1s extends NormSet[], S2s extends NormSet[]> = S1s extends [
  infer H1 extends NormSet,
  ...infer T1 extends NormSet[],
]
  ? S2s extends [infer H2 extends NormSet, ...infer T2 extends NormSet[]]
    ? IntersectsSetPair<H1, H2> extends true
      ? true
      : IntersectsAny<[H1], T2> extends true
        ? true
        : IntersectsAny<T1, S2s>
    : false
  : false;

export type Intersects<R1 extends string, R2 extends string> =
  ParseRange<R1> extends infer A1
    ? ParseRange<R2> extends infer A2
      ? NormalizeRange<A1 & any> extends infer N1 extends NormRange
        ? NormalizeRange<A2 & any> extends infer N2 extends NormRange
          ? IntersectsAny<N1, N2>
          : never
        : never
      : never
    : never;

type SatisfiesRange<V extends string, NR extends NormRange> = SatisfiesAny<V, NR, true>;

type SubsetSetInRange<S extends NormSet, R extends NormRange> =
  FoldBounds<S> extends infer B
    ? B extends { lb: LB; ub: UB | UBNone; eq: infer E1 }
      ? E1 extends string
        ? SatisfiesAny<E1, R, true>
        : SatisfiesRange<B["lb"]["v"], R> extends true
          ? [B["ub"]] extends [UBNone]
            ? true
            : B["ub"] extends UB
              ? B["ub"]["strict"] extends false
                ? SatisfiesRange<B["ub"]["v"], R>
                : true
              : never
          : false
      : never
    : never;

type SubsetAll<Sets extends NormSet[], R extends NormRange> = Sets extends [
  infer H extends NormSet,
  ...infer T extends NormSet[],
]
  ? SubsetSetInRange<H, R> extends true
    ? SubsetAll<T, R>
    : false
  : true;

export type Subset<R1 extends string, R2 extends string> =
  ParseRange<R1> extends infer A1
    ? ParseRange<R2> extends infer A2
      ? NormalizeRange<A1 & any> extends infer N1 extends NormRange
        ? NormalizeRange<A2 & any> extends infer N2 extends NormRange
          ? SubsetAll<N1, N2>
          : never
        : never
      : never
    : never;

type NextVersionType<V extends string> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
    pre: infer P extends PreId[];
  }
    ? P extends []
      ? `${A}.${B}.${IncNumStr<C>}`
      : `${A}.${B}.${C}-${PreIdsToStr<[...P, { kind: "num"; v: "0" }]>}`
    : never;

type FindMinForSet<S extends NormSet> =
  FoldBounds<S> extends infer B
    ? B extends { lb: LB; ub: UB | UBNone; eq: infer E }
      ? E extends string
        ? E
        : B extends { lb: infer L extends LB }
          ? L["strict"] extends true
            ? NextVersionType<L["v"]>
            : L["v"]
          : never
      : never
    : never;

type MinOfSets<R extends NormRange, Best extends string | null = null> = R extends [
  infer H extends NormSet,
  ...infer T extends NormSet[],
]
  ? FindMinForSet<H> extends infer Min extends string
    ? Satisfies<Min, R & any> extends true
      ? Best extends string
        ? CmpSemver<Min, Best> extends -1
          ? MinOfSets<T, Min>
          : MinOfSets<T, Best>
        : MinOfSets<T, Min>
      : MinOfSets<T, Best>
    : MinOfSets<T, Best>
  : Best extends string
    ? Best
    : never;

export type FindMinimumForRange<R extends string, O extends { includePrerelease?: boolean } = {}> =
  ParseRange<R> extends infer AST
    ? NormalizeRange<AST & any> extends infer NR extends NormRange
      ? MinOfSets<NR>
      : never
    : never;

type IsOutsideSet<V extends string, S extends NormSet, D extends "<" | ">"> =
  FoldBounds<S> extends infer B
    ? B extends { lb: LB; ub: UB | UBNone; eq: infer E }
      ? E extends string
        ? D extends ">"
          ? CmpSemver<V, E> extends 1
            ? true
            : false
          : CmpSemver<V, E> extends -1
            ? true
            : false
        : B extends { ub: infer U extends UB | UBNone }
          ? [U] extends [UBNone]
            ? false
            : U extends UB
              ? D extends ">"
                ? U["strict"] extends true
                  ? CmpSemver<V, U["v"]> extends -1
                    ? false
                    : true
                  : CmpSemver<V, U["v"]> extends 1
                    ? true
                    : false
                : false
              : never
          : B extends { lb: infer L extends LB }
            ? D extends "<"
              ? L["strict"] extends true
                ? CmpSemver<V, L["v"]> extends 1
                  ? false
                  : true
                : CmpSemver<V, L["v"]> extends -1
                  ? true
                  : false
              : false
            : never
      : never
    : never;

type IsOutsideAny<V extends string, R extends NormRange, D extends "<" | ">"> = R extends [
  infer H extends NormSet,
  ...infer T extends NormSet[],
]
  ? IsOutsideSet<V, H, D> extends true
    ? true
    : IsOutsideAny<V, T, D>
  : true;

export type IsOutsideRange<
  V extends string,
  R extends string,
  D extends "<" | ">",
  O extends { includePrerelease?: boolean } = {},
> =
  Satisfies<V, R, O> extends true
    ? false
    : ParseRange<R> extends infer AST
      ? NormalizeRange<AST & any> extends infer NR extends NormRange
        ? IsOutsideAny<V, NR, D>
        : never
      : never;

export type IsGreaterThanRange<
  V extends string,
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> = IsOutsideRange<V, R, ">", O>;

export type IsLessThanRange<
  V extends string,
  R extends string,
  O extends { includePrerelease?: boolean } = {},
> = IsOutsideRange<V, R, "<", O>;
