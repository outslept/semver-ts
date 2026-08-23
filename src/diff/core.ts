import type { PreId } from "../parser";
import type { Digit } from "../char";
import type { CmpNumStr } from "../comparator";
import type { And, Not } from "../utils/bool";
import type { Eq } from "../utils/eq";

export type EqStr<A extends string, B extends string> = Eq<A, B>;

export type EqStrArr<A extends string[], B extends string[]> = A extends [
  infer HA extends string,
  ...infer TA extends string[],
]
  ? B extends [infer HB extends string, ...infer TB extends string[]]
    ? EqStr<HA, HB> extends true
      ? EqStrArr<TA, TB>
      : false
    : false
  : B extends []
    ? true
    : false;

export type IsZero<S extends string> = EqStr<S, "0">;

export type NumEq<A extends string, B extends string> = CmpNumStr<A, B> extends 0 ? true : false;

export type PreEmpty<P extends PreId[]> = P extends [] ? true : false;

export type PreNonEmpty<P extends PreId[]> = Not<PreEmpty<P>>;

export type IncNumStrCarry<S extends string> = S extends ""
  ? "1"
  : S extends `${infer R}${infer D extends Digit}`
    ? D extends "9"
      ? `${IncNumStrCarry<R>}0`
      : `${R}${D extends "0" ? "1" : D extends "1" ? "2" : D extends "2" ? "3" : D extends "3" ? "4" : D extends "4" ? "5" : D extends "5" ? "6" : D extends "6" ? "7" : D extends "7" ? "8" : D extends "8" ? "9" : "0"}`
    : never;

export type IncNumStr<S extends string> = S extends `${infer R}${infer D extends Digit}`
  ? D extends "9"
    ? `${IncNumStrCarry<R>}0`
    : `${R}${D extends "0" ? "1" : D extends "1" ? "2" : D extends "2" ? "3" : D extends "3" ? "4" : D extends "4" ? "5" : D extends "5" ? "6" : D extends "6" ? "7" : D extends "7" ? "8" : D extends "8" ? "9" : "0"}`
  : never;

export type DiffKind =
  | "major"
  | "premajor"
  | "minor"
  | "preminor"
  | "patch"
  | "prepatch"
  | "prerelease"
  | "build"
  | "none"
  | "downgrade";

export type DiffCore<
  A_MAJ extends string,
  A_MIN extends string,
  A_PAT extends string,
  A_PRE extends PreId[],
  A_BLD extends string[],
  B_MAJ extends string,
  B_MIN extends string,
  B_PAT extends string,
  B_PRE extends PreId[],
  B_BLD extends string[],
  CMP extends -1 | 0 | 1,
> = CMP extends 0
  ? EqStrArr<A_BLD, B_BLD> extends true
    ? "none"
    : "build"
  : CMP extends 1
    ? "downgrade"
    : NumEq<A_MAJ, B_MAJ> extends false
      ? And<
          And<And<EqStr<IncNumStr<A_MAJ>, B_MAJ>, IsZero<B_MIN>>, IsZero<B_PAT>>,
          And<PreEmpty<A_PRE>, PreNonEmpty<B_PRE>>
        > extends true
        ? "premajor"
        : "major"
      : NumEq<A_MIN, B_MIN> extends false
        ? And<
            And<EqStr<IncNumStr<A_MIN>, B_MIN>, IsZero<B_PAT>>,
            And<PreEmpty<A_PRE>, PreNonEmpty<B_PRE>>
          > extends true
          ? "preminor"
          : "minor"
        : NumEq<A_PAT, B_PAT> extends false
          ? And<
              EqStr<IncNumStr<A_PAT>, B_PAT>,
              And<PreEmpty<A_PRE>, PreNonEmpty<B_PRE>>
            > extends true
            ? "prepatch"
            : "patch"
          : "prerelease";
