import type { Tup } from './tuple'

export type CmpNat<
  A extends number,
  B extends number,
  TA extends any[] = Tup<A>,
  TB extends any[] = Tup<B>
> =
  TA['length'] extends TB['length'] ? 0 :
    TA extends [...TB, ...any[]] ? 1 : -1
