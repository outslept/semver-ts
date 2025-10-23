import type { PreId } from '../parser'
import type { IncNumStr } from '../increment'
import type { And } from './bool'
import type { EqStr, EqStrArr } from './eq'
import type { IsZero, NumEq } from './num'
import type { PreEmpty, PreNonEmpty } from './pre'

export type DiffKind =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch'
  | 'prerelease'
  | 'build'
  | 'none'
  | 'downgrade'

export type DiffCore<
  A_MAJ extends string, A_MIN extends string, A_PAT extends string, A_PRE extends PreId[], A_BLD extends string[],
  B_MAJ extends string, B_MIN extends string, B_PAT extends string, B_PRE extends PreId[], B_BLD extends string[],
  CMP extends -1 | 0 | 1
> =
  CMP extends 0
    ? (EqStrArr<A_BLD, B_BLD> extends true ? 'none' : 'build')
    : (CMP extends 1
        ? 'downgrade'
        : (
            NumEq<A_MAJ, B_MAJ> extends false
              ? (
                  And<And<And<EqStr<IncNumStr<A_MAJ>, B_MAJ>, IsZero<B_MIN>>, IsZero<B_PAT>>, And<PreEmpty<A_PRE>, PreNonEmpty<B_PRE>>> extends true
                    ? 'premajor'
                    : 'major'
                )
              : (NumEq<A_MIN, B_MIN> extends false
                  ? (
                      And<And<EqStr<IncNumStr<A_MIN>, B_MIN>, IsZero<B_PAT>>, And<PreEmpty<A_PRE>, PreNonEmpty<B_PRE>>> extends true
                        ? 'preminor'
                        : 'minor'
                    )
                  : (NumEq<A_PAT, B_PAT> extends false
                      ? (
                          And<EqStr<IncNumStr<A_PAT>, B_PAT>, And<PreEmpty<A_PRE>, PreNonEmpty<B_PRE>>> extends true
                            ? 'prepatch'
                            : 'patch'
                        )
                      : 'prerelease'
                    )
                )
          )
      )
