import type { Digit } from "./char.js";
import type { CmpNumStr, CmpSemver } from "./comparator.js";
import type { ParseSemver, PreId } from "./parser.js";
import type { And, Eq, Not } from "./utils.js";

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
      : `${R}${D extends "0"
          ? "1"
          : D extends "1"
            ? "2"
            : D extends "2"
              ? "3"
              : D extends "3"
                ? "4"
                : D extends "4"
                  ? "5"
                  : D extends "5"
                    ? "6"
                    : D extends "6"
                      ? "7"
                      : D extends "7"
                        ? "8"
                        : D extends "8"
                          ? "9"
                          : "0"}`
    : never;

export type IncNumStr<S extends string> = S extends `${infer R}${infer D extends Digit}`
  ? D extends "9"
    ? `${IncNumStrCarry<R>}0`
    : `${R}${D extends "0"
        ? "1"
        : D extends "1"
          ? "2"
          : D extends "2"
            ? "3"
            : D extends "3"
              ? "4"
              : D extends "4"
                ? "5"
                : D extends "5"
                  ? "6"
                  : D extends "6"
                    ? "7"
                    : D extends "7"
                      ? "8"
                      : D extends "8"
                        ? "9"
                        : "0"}`
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
    : (
          And<PreNonEmpty<A_PRE>, PreEmpty<B_PRE>> extends true
            ? IsZero<A_PAT> extends true
              ? IsZero<A_MIN> extends true
                ? "major"
                : And<NumEq<A_MAJ, B_MAJ>, NumEq<A_MIN, B_MIN>> extends true
                  ? "minor"
                  : "fallthrough"
              : And<And<NumEq<A_MAJ, B_MAJ>, NumEq<A_MIN, B_MIN>>, NumEq<A_PAT, B_PAT>> extends true
                ? "patch"
                : "fallthrough"
            : "fallthrough"
        ) extends infer PreToStable
      ? PreToStable extends "fallthrough"
        ? PreNonEmpty<B_PRE> extends true
          ? NumEq<A_MAJ, B_MAJ> extends false
            ? "premajor"
            : NumEq<A_MIN, B_MIN> extends false
              ? "preminor"
              : NumEq<A_PAT, B_PAT> extends false
                ? "prepatch"
                : "prerelease"
          : NumEq<A_MAJ, B_MAJ> extends false
            ? "major"
            : NumEq<A_MIN, B_MIN> extends false
              ? "minor"
              : NumEq<A_PAT, B_PAT> extends false
                ? "patch"
                : "prerelease"
        : PreToStable
      : never;

type EqPreId<A extends PreId, B extends PreId> =
  Eq<A["kind"], B["kind"]> extends true ? EqStr<A["v"], B["v"]> : false;

type EqPreArr<A extends PreId[], B extends PreId[]> = A extends [
  infer HA extends PreId,
  ...infer TA extends PreId[],
]
  ? B extends [infer HB extends PreId, ...infer TB extends PreId[]]
    ? EqPreId<HA, HB> extends true
      ? EqPreArr<TA, TB>
      : false
    : false
  : B extends []
    ? true
    : false;

export type SemverDiff<A extends string, B extends string> =
  ParseSemver<A> extends {
    major: infer A_MAJ extends string;
    minor: infer A_MIN extends string;
    patch: infer A_PAT extends string;
    pre: infer A_PRE extends PreId[];
    build: infer A_BLD extends string[];
  }
    ? ParseSemver<B> extends {
        major: infer B_MAJ extends string;
        minor: infer B_MIN extends string;
        patch: infer B_PAT extends string;
        pre: infer B_PRE extends PreId[];
        build: infer B_BLD extends string[];
      }
      ? CmpSemver<A, B> extends infer CMP extends -1 | 0 | 1
        ? DiffCore<A_MAJ, A_MIN, A_PAT, A_PRE, A_BLD, B_MAJ, B_MIN, B_PAT, B_PRE, B_BLD, CMP>
        : never
      : never
    : never;

export type SemverDiffNpm<A extends string, B extends string> =
  SemverDiff<A, B> extends infer K ? (K extends "build" | "none" | "downgrade" ? null : K) : never;

export type SemverChangedFlags<A extends string, B extends string> =
  ParseSemver<A> extends {
    major: infer A_MAJ extends string;
    minor: infer A_MIN extends string;
    patch: infer A_PAT extends string;
    pre: infer A_PRE extends PreId[];
    build: infer A_BLD extends string[];
  }
    ? ParseSemver<B> extends {
        major: infer B_MAJ extends string;
        minor: infer B_MIN extends string;
        patch: infer B_PAT extends string;
        pre: infer B_PRE extends PreId[];
        build: infer B_BLD extends string[];
      }
      ? {
          up: CmpSemver<A, B> extends -1 ? true : false;
          down: CmpSemver<A, B> extends 1 ? true : false;
          samePrecedence: CmpSemver<A, B> extends 0 ? true : false;
          major: NumEq<A_MAJ, B_MAJ> extends true ? false : true;
          minor: NumEq<A_MIN, B_MIN> extends true ? false : true;
          patch: NumEq<A_PAT, B_PAT> extends true ? false : true;
          prerelease: EqPreArr<A_PRE, B_PRE> extends true ? false : true;
          build: EqStrArr<A_BLD, B_BLD> extends true ? false : true;
        }
      : never
    : never;

export type SemverDiffNeutral<A extends string, B extends string> =
  SemverDiff<A, B> extends infer K
    ? K extends "downgrade"
      ? SemverDiff<B, A>
      : K extends "build" | "none"
        ? null
        : K
    : never;

export type PreChange =
  | { ix: number; kind: "insert"; to: PreId }
  | { ix: number; kind: "remove"; from: PreId }
  | { ix: number; kind: "replace"; from: PreId; to: PreId };

export type BuildChange =
  | { ix: number; kind: "insert"; to: string }
  | { ix: number; kind: "remove"; from: string }
  | { ix: number; kind: "replace"; from: string; to: string };

export type DiffPreArr<A extends PreId[], B extends PreId[], Acc extends any[] = []> = A extends [
  infer HA extends PreId,
  ...infer TA extends PreId[],
]
  ? B extends [infer HB extends PreId, ...infer TB extends PreId[]]
    ? EqPreId<HA, HB> extends true
      ? DiffPreArr<TA, TB, [...Acc, unknown]>
      : [
          {
            ix: Acc["length"];
            kind: "replace";
            from: HA;
            to: HB;
          },
          ...DiffPreArr<TA, TB, [...Acc, unknown]>,
        ]
    : [
        {
          ix: Acc["length"];
          kind: "remove";
          from: HA;
        },
        ...DiffPreArr<TA, [], [...Acc, unknown]>,
      ]
  : B extends [infer HB2 extends PreId, ...infer TB2 extends PreId[]]
    ? [
        {
          ix: Acc["length"];
          kind: "insert";
          to: HB2;
        },
        ...DiffPreArr<[], TB2, [...Acc, unknown]>,
      ]
    : [];

export type DiffStrArr<A extends string[], B extends string[], Acc extends any[] = []> = A extends [
  infer HA extends string,
  ...infer TA extends string[],
]
  ? B extends [infer HB extends string, ...infer TB extends string[]]
    ? EqStr<HA, HB> extends true
      ? DiffStrArr<TA, TB, [...Acc, unknown]>
      : [
          {
            ix: Acc["length"];
            kind: "replace";
            from: HA;
            to: HB;
          },
          ...DiffStrArr<TA, TB, [...Acc, unknown]>,
        ]
    : [
        {
          ix: Acc["length"];
          kind: "remove";
          from: HA;
        },
        ...DiffStrArr<TA, [], [...Acc, unknown]>,
      ]
  : B extends [infer HB2 extends string, ...infer TB2 extends string[]]
    ? [
        {
          ix: Acc["length"];
          kind: "insert";
          to: HB2;
        },
        ...DiffStrArr<[], TB2, [...Acc, unknown]>,
      ]
    : [];

export type TokenDiff<A extends string, B extends string> =
  ParseSemver<A> extends {
    pre: infer A_PRE extends PreId[];
    build: infer A_BLD extends string[];
  }
    ? ParseSemver<B> extends {
        pre: infer B_PRE extends PreId[];
        build: infer B_BLD extends string[];
      }
      ? {
          prerelease: DiffPreArr<A_PRE, B_PRE>;
          build: DiffStrArr<A_BLD, B_BLD>;
        }
      : never
    : never;
