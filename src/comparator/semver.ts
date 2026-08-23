import type { ParseSemver, PreId } from "../parser";
import type { IsNumericId } from "../string/numeric.js";
import type { And, Not } from "../utils/bool.js";
import type { CmpCore } from "./core";
import type { CmpNumStr } from "./numstr.js";
import type { CmpPre } from "./pre";
import type { CmpStrLex } from "./str.js";

export type CmpSemver<A extends string, B extends string> =
  ParseSemver<A> extends infer SA
    ? SA extends { major: string; minor: string; patch: string; pre: PreId[] }
      ? ParseSemver<B> extends infer SB
        ? SB extends { major: string; minor: string; patch: string; pre: PreId[] }
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
  : B extends [infer HB2 extends string, ...infer TB2 extends string[]]
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
