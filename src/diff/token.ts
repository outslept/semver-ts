import type { ParseSemver, PreId } from '../parser'
import type { Eq } from '../utils/eq'

type EqStr<A extends string, B extends string> = Eq<A, B>

type EqPreId<A extends PreId, B extends PreId> =
  Eq<A['kind'], B['kind']> extends true ? EqStr<A['v'], B['v']> : false

export type PreChange =
  | { ix: number; kind: 'insert'; to: PreId }
  | { ix: number; kind: 'remove'; from: PreId }
  | { ix: number; kind: 'replace'; from: PreId; to: PreId }

export type BuildChange =
  | { ix: number; kind: 'insert'; to: string }
  | { ix: number; kind: 'remove'; from: string }
  | { ix: number; kind: 'replace'; from: string; to: string }

export type DiffPreArr<A extends PreId[], B extends PreId[], Acc extends any[] = []> =
  A extends [infer HA extends PreId, ...infer TA extends PreId[]]
    ? (B extends [infer HB extends PreId, ...infer TB extends PreId[]]
        ? (EqPreId<HA, HB> extends true
            ? DiffPreArr<TA, TB, [...Acc, unknown]>
            : [{ ix: Acc['length']; kind: 'replace'; from: HA; to: HB }, ...DiffPreArr<TA, TB, [...Acc, unknown]>])
        : [{ ix: Acc['length']; kind: 'remove'; from: HA }, ...DiffPreArr<TA, [], [...Acc, unknown]>])
    : (B extends [infer HB2 extends PreId, ...infer TB2 extends PreId[]]
        ? [{ ix: Acc['length']; kind: 'insert'; to: HB2 }, ...DiffPreArr<[], TB2, [...Acc, unknown]>]
        : [])

export type DiffStrArr<A extends string[], B extends string[], Acc extends any[] = []> =
  A extends [infer HA extends string, ...infer TA extends string[]]
    ? (B extends [infer HB extends string, ...infer TB extends string[]]
        ? (EqStr<HA, HB> extends true
            ? DiffStrArr<TA, TB, [...Acc, unknown]>
            : [{ ix: Acc['length']; kind: 'replace'; from: HA; to: HB }, ...DiffStrArr<TA, TB, [...Acc, unknown]>])
        : [{ ix: Acc['length']; kind: 'remove'; from: HA }, ...DiffStrArr<TA, [], [...Acc, unknown]>])
    : (B extends [infer HB2 extends string, ...infer TB2 extends string[]]
        ? [{ ix: Acc['length']; kind: 'insert'; to: HB2 }, ...DiffStrArr<[], TB2, [...Acc, unknown]>]
        : [])

export type TokenDiff<A extends string, B extends string> =
  ParseSemver<A> extends { pre: infer A_PRE extends PreId[]; build: infer A_BLD extends string[] }
    ? ParseSemver<B> extends { pre: infer B_PRE extends PreId[]; build: infer B_BLD extends string[] }
      ? { prerelease: DiffPreArr<A_PRE, B_PRE>; build: DiffStrArr<A_BLD, B_BLD> }
      : never
    : never
