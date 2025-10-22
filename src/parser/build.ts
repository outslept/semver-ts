import type { IsAlphaNumDashToken, SplitDotsNonEmpty } from '../string'

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
