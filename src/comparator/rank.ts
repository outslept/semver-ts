import type { CmpNat } from './nat'

export type CmpRank<
  A extends [number, number],
  B extends [number, number]
> =
  A extends [infer CA extends number, infer IA extends number]
    ? B extends [infer CB extends number, infer IB extends number]
      ? (CmpNat<CA, CB> extends 0 ? CmpNat<IA, IB> : CmpNat<CA, CB>)
      : never
    : never
