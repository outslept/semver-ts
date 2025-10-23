import type { CmpNumStr } from './numstr'

export type CmpCore<
  A extends { major: string; minor: string; patch: string },
  B extends { major: string; minor: string; patch: string }
> =
  CmpNumStr<A['major'], B['major']> extends infer C1
    ? C1 extends 0
      ? CmpNumStr<A['minor'], B['minor']> extends infer C2
        ? C2 extends 0
          ? CmpNumStr<A['patch'], B['patch']>
          : C2
        : never
      : C1
    : never
