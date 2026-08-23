import type { IsNumericId, IsAlphaNumDashToken, SplitDotsNonEmpty } from "../string";
import type { IsDigits } from "../string/digits.js";
import type { PreId, PreNum, PreStr } from "./types";

export type TokenizePreId<S extends string> =
  IsDigits<S> extends true
    ? IsNumericId<S> extends true
      ? PreNum<S>
      : never
    : IsAlphaNumDashToken<S> extends true
      ? PreStr<S>
      : never;

export type MapPreTokens<Ts extends string[], Acc extends PreId[] = []> = Ts extends [
  infer H extends string,
  ...infer R extends string[],
]
  ? TokenizePreId<H> extends infer X
    ? [X] extends [never]
      ? never
      : X extends PreId
        ? MapPreTokens<R, [...Acc, X]>
        : never
    : never
  : Acc;

export type ParsePre<S extends string> =
  SplitDotsNonEmpty<S> extends infer Ts ? (Ts extends string[] ? MapPreTokens<Ts> : never) : never;

export type IsValidPre<S extends string> = ParsePre<S> extends never ? false : true;
