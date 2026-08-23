import type {
  IsNumericId,
  IsNumericIdLoose,
  IsAlphaNumDashToken,
  IsDigits,
  SplitDotsNonEmpty,
} from "./string.js";

export type PreNum<V extends string = string> = {
  kind: "num";
  v: V;
};

export type PreStr<V extends string = string> = {
  kind: "str";
  v: V;
};

export type PreId<V extends string = string> = PreNum<V> | PreStr<V>;

export type ParserMode = "strict" | "loose";
export type Strict = "strict";
export type Loose = "loose";

type CheckNumeric<S extends string, M extends ParserMode> = M extends "loose"
  ? IsNumericIdLoose<S> extends true
    ? true
    : false
  : IsNumericId<S> extends true
    ? true
    : false;

export type ParseCore<
  S extends string,
  M extends ParserMode = "strict",
> = S extends `${infer A}.${infer R1} `
  ? R1 extends `${infer B}.${infer C} `
    ? CheckNumeric<A, M> extends true
      ? CheckNumeric<B, M> extends true
        ? CheckNumeric<C, M> extends true
          ? { major: A; minor: B; patch: C }
          : never
        : never
      : never
    : never
  : never;

export type IsValidCore<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends never ? false : true;

export type MajorOf<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends { major: infer X extends string } ? X : never;

export type MinorOf<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends { minor: infer X extends string } ? X : never;

export type PatchOf<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends { patch: infer X extends string } ? X : never;

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

export type MapBuildTokens<Ts extends string[], Acc extends string[] = []> = Ts extends [
  infer H extends string,
  ...infer R extends string[],
]
  ? IsAlphaNumDashToken<H> extends true
    ? MapBuildTokens<R, [...Acc, H]>
    : never
  : Acc;

export type ParseBuild<S extends string> =
  SplitDotsNonEmpty<S> extends infer Ts
    ? Ts extends string[]
      ? MapBuildTokens<Ts>
      : never
    : never;

export type IsValidBuild<S extends string> = ParseBuild<S> extends never ? false : true;

type ParseCoreAndPre<
  S extends string,
  M extends ParserMode,
> = S extends `${infer Core extends string}-${infer Pre extends string}`
  ? ParseCore<Core, M> extends infer C
    ? C extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer P extends string;
      }
      ? ParsePre<Pre, M> extends infer PR
        ? PR extends PreId[]
          ? { major: A; minor: B; patch: P; pre: PR }
          : never
        : never
      : never
    : never
  : ParseCore<S, M> extends infer C2
    ? C2 extends {
        major: infer A2 extends string;
        minor: infer B2 extends string;
        patch: infer P2 extends string;
      }
      ? { major: A2; minor: B2; patch: P2; pre: [] }
      : never
    : never;

export type ParseSemver<
  S extends string,
  M extends ParserMode = "strict",
> = S extends `${infer Left}+${infer Build}`
  ? ParseCoreAndPre<Left, M> extends infer CP
    ? CP extends {
        major: string;
        minor: string;
        patch: string;
        pre: PreId[];
      }
      ? ParseBuild<Build> extends infer BD
        ? BD extends string[]
          ? {
              major: CP["major"];
              minor: CP["minor"];
              patch: CP["patch"];
              pre: CP["pre"];
              build: BD;
            }
          : never
        : never
      : never
    : never
  : ParseCoreAndPre<S, M> extends infer CP2
    ? CP2 extends {
        major: string;
        minor: string;
        patch: string;
        pre: PreId[];
      }
      ? {
          major: CP2["major"];
          minor: CP2["minor"];
          patch: CP2["patch"];
          pre: CP2["pre"];
          build: [];
        }
      : never
    : never;

export type IsValidSemver<S extends string, M extends ParserMode = "strict"> =
  ParseSemver<S, M> extends never ? false : true;

export type Semver<S extends string, M extends ParserMode = "strict"> =
  IsValidSemver<S, M> extends true ? S & { __semver: true } : never;
