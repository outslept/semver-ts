import type { CharRank } from "./char.js";
import type { ParseSemver, PreId } from "./parser.js";
import type { IsNumericId } from "./string.js";
import type { And, Not } from "./utils.js";

export type Tup<N extends number, R extends any[] = []> = R["length"] extends N
  ? R
  : Tup<N, [...R, unknown]>;

export type CmpNat<
  A extends number,
  B extends number,
  TA extends any[] = Tup<A>,
  TB extends any[] = Tup<B>,
> = TA["length"] extends TB["length"] ? 0 : TA extends [...TB, ...any[]] ? 1 : -1;

export type CmpRank<A extends [number, number], B extends [number, number]> = A extends [
  infer CA extends number,
  infer IA extends number,
]
  ? B extends [infer CB extends number, infer IB extends number]
    ? CmpNat<CA, CB> extends 0
      ? CmpNat<IA, IB>
      : CmpNat<CA, CB>
    : never
  : never;

export type CmpChar<A extends string, B extends string> =
  CharRank<A> extends infer RA
    ? RA extends [number, number]
      ? CharRank<B> extends infer RB
        ? RB extends [number, number]
          ? CmpRank<RA, RB>
          : never
        : never
      : never
    : never;

export type CmpLen<A extends string, B extends string> = A extends ""
  ? B extends ""
    ? 0
    : -1
  : B extends ""
    ? 1
    : A extends `${infer _A}${infer RA}`
      ? B extends `${infer _B}${infer RB}`
        ? CmpLen<RA, RB>
        : never
      : never;

export type CmpStrLex<A extends string, B extends string> = A extends ""
  ? B extends ""
    ? 0
    : -1
  : B extends ""
    ? 1
    : A extends `${infer CA}${infer RA}`
      ? B extends `${infer CB}${infer RB}`
        ? CmpChar<CA, CB> extends 0
          ? CmpStrLex<RA, RB>
          : CmpChar<CA, CB>
        : never
      : never;

export type CmpNumStr<A extends string, B extends string> =
  CmpLen<A, B> extends infer L ? (L extends 0 ? CmpStrLex<A, B> : L) : never;

export type CmpPreId<A extends PreId, B extends PreId> = A extends {
  kind: "num";
  v: infer VA extends string;
}
  ? B extends {
      kind: "num";
      v: infer VB extends string;
    }
    ? CmpNumStr<VA, VB>
    : -1
  : B extends { kind: "num" }
    ? 1
    : A extends {
          kind: "str";
          v: infer SA extends string;
        }
      ? B extends {
          kind: "str";
          v: infer SB extends string;
        }
        ? CmpStrLex<SA, SB>
        : never
      : never;

export type CmpPre<A extends PreId[], B extends PreId[]> = A extends [
  infer HA extends PreId,
  ...infer TA extends PreId[],
]
  ? B extends [infer HB extends PreId, ...infer TB extends PreId[]]
    ? CmpPreId<HA, HB> extends 0
      ? CmpPre<TA, TB>
      : CmpPreId<HA, HB>
    : 1
  : B extends []
    ? 0
    : -1;

export type CmpCore<
  A extends { major: string; minor: string; patch: string },
  B extends { major: string; minor: string; patch: string },
> =
  CmpNumStr<A["major"], B["major"]> extends infer C1
    ? C1 extends 0
      ? CmpNumStr<A["minor"], B["minor"]> extends infer C2
        ? C2 extends 0
          ? CmpNumStr<A["patch"], B["patch"]>
          : C2
        : never
      : C1
    : never;

export type CmpSemver<A extends string, B extends string> =
  ParseSemver<A> extends infer SA
    ? SA extends {
        major: string;
        minor: string;
        patch: string;
        pre: PreId[];
      }
      ? ParseSemver<B> extends infer SB
        ? SB extends {
            major: string;
            minor: string;
            patch: string;
            pre: PreId[];
          }
          ? CmpCore<SA, SB> extends infer CC
            ? CC extends 0
              ? SA["pre"] extends []
                ? SB["pre"] extends []
                  ? 0
                  : 1
                : SB["pre"] extends []
                  ? -1
                  : CmpPre<SA["pre"], SB["pre"]>
              : CC
            : never
          : never
        : never
      : never
    : never;

type CmpBuildId<A extends string, B extends string> =
  And<IsNumericId<A>, IsNumericId<B>> extends true
    ? CmpNumStr<A, B>
    : And<IsNumericId<A>, Not<IsNumericId<B>>> extends true
      ? -1
      : And<Not<IsNumericId<A>>, IsNumericId<B>> extends true
        ? 1
        : CmpStrLex<A, B>;

type CmpBuildArr<A extends string[], B extends string[]> = A extends [
  infer HA extends string,
  ...infer TA extends string[],
]
  ? B extends [infer HB extends string, ...infer TB extends string[]]
    ? CmpBuildId<HA, HB> extends 0
      ? CmpBuildArr<TA, TB>
      : CmpBuildId<HA, HB>
    : 1
  : B extends [infer _HB2 extends string, ...infer _TB2 extends string[]]
    ? -1
    : 0;

export type CmpBuild<A extends string, B extends string> =
  CmpSemver<A, B> extends infer C
    ? C extends 0
      ? ParseSemver<A> extends { build: infer BA extends string[] }
        ? ParseSemver<B> extends { build: infer BB extends string[] }
          ? CmpBuildArr<BA, BB>
          : never
        : never
      : C
    : never;

export type Lt<A extends string, B extends string> = CmpSemver<A, B> extends -1 ? true : false;

export type Lte<A extends string, B extends string> = CmpSemver<A, B> extends 1 ? false : true;

export type Gt<A extends string, B extends string> = CmpSemver<A, B> extends 1 ? true : false;

export type Gte<A extends string, B extends string> = CmpSemver<A, B> extends -1 ? false : true;

export type EqSemver<A extends string, B extends string> = CmpSemver<A, B> extends 0 ? true : false;
