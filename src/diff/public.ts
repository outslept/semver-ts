import type { ParseSemver, PreId } from '../parser'
import type { CmpSemver, CmpNumStr } from '../comparator'
import type { DiffCore } from './core'
import type { Eq } from '../utils/eq'

type EqStr<A extends string, B extends string> = Eq<A, B>

type EqStrArr<A extends string[], B extends string[]> =
  A extends [infer HA extends string, ...infer TA extends string[]]
    ? (B extends [infer HB extends string, ...infer TB extends string[]]
        ? (EqStr<HA, HB> extends true ? EqStrArr<TA, TB> : false)
        : false)
    : (B extends [] ? true : false)

type EqPreId<A extends PreId, B extends PreId> =
  Eq<A['kind'], B['kind']> extends true ? EqStr<A['v'], B['v']> : false

type EqPreArr<A extends PreId[], B extends PreId[]> =
  A extends [infer HA extends PreId, ...infer TA extends PreId[]]
    ? (B extends [infer HB extends PreId, ...infer TB extends PreId[]]
        ? (EqPreId<HA, HB> extends true ? EqPreArr<TA, TB> : false)
        : false)
    : (B extends [] ? true : false)

type NumEq<A extends string, B extends string> = CmpNumStr<A, B> extends 0 ? true : false

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
    : never

export type SemverDiffNpm<A extends string, B extends string> =
  SemverDiff<A, B> extends infer K
    ? K extends 'build' | 'none' | 'downgrade' ? null : K
    : never

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
          up: CmpSemver<A, B> extends -1 ? true : false
          down: CmpSemver<A, B> extends 1 ? true : false
          samePrecedence: CmpSemver<A, B> extends 0 ? true : false
          major: NumEq<A_MAJ, B_MAJ> extends true ? false : true
          minor: NumEq<A_MIN, B_MIN> extends true ? false : true
          patch: NumEq<A_PAT, B_PAT> extends true ? false : true
          prerelease: EqPreArr<A_PRE, B_PRE> extends true ? false : true
          build: EqStrArr<A_BLD, B_BLD> extends true ? false : true
        }
      : never
    : never
