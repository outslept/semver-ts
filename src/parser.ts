import type { IsNumericId, IsAlphaNumDashToken, SplitDotsNonEmpty } from './string'

export type PreNum<V extends string = string> = { kind: 'num'; v: V }
export type PreStr<V extends string = string> = { kind: 'str'; v: V }
export type PreId<V extends string = string> = PreNum<V> | PreStr<V>

export type ParseCore<S extends string> =
  S extends `${infer A}.${infer R1}`
    ? R1 extends `${infer B}.${infer C}`
      ? IsNumericId<A> extends true
        ? IsNumericId<B> extends true
          ? IsNumericId<C> extends true
            ? { major: A; minor: B; patch: C }
            : never
          : never
        : never
      : never
    : never

export type IsValidCore<S extends string> =
  ParseCore<S> extends never ? false : true

export type MajorOf<S extends string> =
  ParseCore<S> extends { major: infer M extends string } ? M : never

export type MinorOf<S extends string> =
  ParseCore<S> extends { minor: infer M extends string } ? M : never

export type PatchOf<S extends string> =
  ParseCore<S> extends { patch: infer P extends string } ? P : never

export type TokenizePreId<S extends string> =
  IsNumericId<S> extends true ? PreNum<S> :
    IsAlphaNumDashToken<S> extends true ? PreStr<S> :
      never

export type MapPreTokens<Ts extends string[], Acc extends PreId[] = []> =
  Ts extends [infer H extends string, ...infer R extends string[]]
    ? TokenizePreId<H> extends infer X
      ? [X] extends [never]
          ? never
          : X extends PreId
            ? MapPreTokens<R, [...Acc, X]>
            : never
      : never
    : Acc

export type ParsePre<S extends string> =
  SplitDotsNonEmpty<S> extends infer Ts
    ? Ts extends string[] ? MapPreTokens<Ts> : never
    : never

export type IsValidPre<S extends string> = ParsePre<S> extends never ? false : true

export type MapBuildTokens<Ts extends string[], Acc extends string[] = []> =
  Ts extends [infer H extends string, ...infer R extends string[]]
    ? IsAlphaNumDashToken<H> extends true
      ? MapBuildTokens<R, [...Acc, H]>
      : never
    : Acc

export type ParseBuild<S extends string> =
  SplitDotsNonEmpty<S> extends infer Ts
    ? Ts extends string[] ? MapBuildTokens<Ts> : never
    : never

export type IsValidBuild<S extends string> = ParseBuild<S> extends never ? false : true

type ParseCoreAndPre<S extends string> =
  S extends `${infer Core extends string}-${infer Pre extends string}`
    ? ParseCore<Core> extends infer C
      ? C extends { major: infer A extends string; minor: infer B extends string; patch: infer P extends string }
        ? ParsePre<Pre> extends infer PR
          ? PR extends PreId[] ? { major: A; minor: B; patch: P; pre: PR } : never
          : never
        : never
      : never
    : ParseCore<S> extends infer C2
      ? C2 extends { major: infer A2 extends string; minor: infer B2 extends string; patch: infer P2 extends string }
        ? { major: A2; minor: B2; patch: P2; pre: [] }
        : never
      : never

export type ParseSemver<S extends string> =
  S extends `${infer Left}+${infer Build}`
    ? ParseCoreAndPre<Left> extends infer CP
      ? CP extends { major: string; minor: string; patch: string; pre: PreId[] }
        ? ParseBuild<Build> extends infer BD
          ? BD extends string[]
            ? { major: CP['major']; minor: CP['minor']; patch: CP['patch']; pre: CP['pre']; build: BD }
            : never
          : never
        : never
      : never
    : ParseCoreAndPre<S> extends infer CP2
      ? CP2 extends { major: string; minor: string; patch: string; pre: PreId[] }
        ? { major: CP2['major']; minor: CP2['minor']; patch: CP2['patch']; pre: CP2['pre']; build: [] }
        : never
      : never

export type IsValidSemver<S extends string> = ParseSemver<S> extends never ? false : true
