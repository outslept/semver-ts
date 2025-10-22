import type { Dash, Digit, Upper, Lower } from './tokens'
import type { DigitsArr, UppersArr, LowersArr } from './arrays'
import type { IndexIn } from './index-in'

export type CharCategory<C extends string> =
  C extends Dash ? 0 :
    C extends Digit ? 1 :
      C extends Upper ? 2 :
        C extends Lower ? 3 :
          never

export type CharRank<C extends string> =
  C extends Dash ? [0, 0] :
    C extends Digit ? [1, IndexIn<DigitsArr, C>] :
      C extends Upper ? [2, IndexIn<UppersArr, C>] :
        C extends Lower ? [3, IndexIn<LowersArr, C>] :
          never
