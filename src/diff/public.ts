import type { ParseSemver, PreId } from '../parser'
import type { CmpSemver } from '../comparator'
import type { DiffCore } from './core'
import type { EqPreArr, EqStrArr } from './eq'
import type { NumEq } from './num'

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
