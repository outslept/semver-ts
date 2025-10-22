import type { PreId } from './types'
import type { ParseCore } from './core'
import type { ParsePre } from './pre'
import type { ParseBuild } from './build'

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
