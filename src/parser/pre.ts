import type {
  IsNumericId,
  IsNumericIdLoose,
  IsAlphaNumDashToken,
  IsDigits,
  SplitDotsNonEmpty,
} from "../string";
import type { PreId, PreNum, PreStr } from "./types";
import type { ParserMode } from "./mode";

type CheckNumericPre<S extends string, M extends ParserMode> =
  IsDigits<S> extends true
    ? M extends "loose"
      ? IsNumericIdLoose<S> extends true
        ? PreNum<S>
        : never
      : IsNumericId<S> extends true
        ? PreNum<S>
        : never
    : never;

export type TokenizePreId<S extends string, M extends ParserMode = "strict"> =
  IsDigits<S> extends true
    ? CheckNumericPre<S, M>
    : IsAlphaNumDashToken<S> extends true
      ? PreStr<S>
      : never;

export type MapPreTokens<
  Ts extends string[],
  M extends ParserMode,
  Acc extends PreId[] = [],
> = Ts extends [infer H extends string, ...infer R extends string[]]
  ? TokenizePreId<H, M> extends infer X
    ? [X] extends [never]
      ? never
      : X extends PreId
        ? MapPreTokens<R, M, [...Acc, X]>
        : never
    : never
  : Acc;

export type ParsePre<S extends string, M extends ParserMode = "strict"> =
  SplitDotsNonEmpty<S> extends infer Ts
    ? Ts extends string[]
      ? MapPreTokens<Ts, M>
      : never
    : never;

export type IsValidPre<S extends string, M extends ParserMode = "strict"> =
  ParsePre<S, M> extends never ? false : true;
