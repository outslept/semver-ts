import type { ParseSemver, PreId } from '../parser'
import type { IsAlphaNumDashToken } from '../string'
import type { BuildToStr } from './build'
import type {
  NextPatch,
  NextMinor,
  NextMajor,
  NextPatchKeepBuild,
  NextMinorKeepBuild,
  NextMajorKeepBuild
} from './core-bumps'
import type {
  Prepatch,
  Preminor,
  Premajor,
  PrepatchKeepBuild,
  PreminorKeepBuild,
  PremajorKeepBuild,
  NextPreSafe,
  NextPreKeepBuild
} from './pre'

type OptKeep<O> = O extends { keepBuild: infer K extends boolean } ? K : false
type OptPreid<O> = O extends { preid: infer P extends string } ? P : 'rc'

type Release<V extends string, Keep extends boolean> =
  ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string; patch: infer C extends string; build: infer BD extends string[] }
    ? (Keep extends true
        ? (BD extends [] ? `${A}.${B}.${C}` : `${A}.${B}.${C}+${BuildToStr<BD>}`)
        : `${A}.${B}.${C}`)
    : never

type IncPrepatch<V extends string, O> =
  IsAlphaNumDashToken<OptPreid<O>> extends true
    ? (OptKeep<O> extends true ? PrepatchKeepBuild<V, OptPreid<O>> : Prepatch<V, OptPreid<O>>)
    : never

type IncPreminor<V extends string, O> =
  IsAlphaNumDashToken<OptPreid<O>> extends true
    ? (OptKeep<O> extends true ? PreminorKeepBuild<V, OptPreid<O>> : Preminor<V, OptPreid<O>>)
    : never

type IncPremajor<V extends string, O> =
  IsAlphaNumDashToken<OptPreid<O>> extends true
    ? (OptKeep<O> extends true ? PremajorKeepBuild<V, OptPreid<O>> : Premajor<V, OptPreid<O>>)
    : never

type IncPrerelease<V extends string, O> =
  IsAlphaNumDashToken<OptPreid<O>> extends true
    ? (ParseSemver<V> extends { pre: infer P extends PreId[] }
        ? (P extends []
            ? (OptKeep<O> extends true ? PrepatchKeepBuild<V, OptPreid<O>> : Prepatch<V, OptPreid<O>>)
            : (OptKeep<O> extends true ? NextPreKeepBuild<V, OptPreid<O>> : NextPreSafe<V, OptPreid<O>>))
        : never)
    : never

export type Inc<
  V extends string,
  Kind extends 'patch' | 'minor' | 'major' | 'prepatch' | 'preminor' | 'premajor' | 'prerelease' | 'release',
  Opts extends { preid?: string; keepBuild?: boolean } = {}
> =
  Kind extends 'patch' ? (OptKeep<Opts> extends true ? NextPatchKeepBuild<V> : NextPatch<V>) :
    Kind extends 'minor' ? (OptKeep<Opts> extends true ? NextMinorKeepBuild<V> : NextMinor<V>) :
      Kind extends 'major' ? (OptKeep<Opts> extends true ? NextMajorKeepBuild<V> : NextMajor<V>) :
        Kind extends 'prepatch' ? IncPrepatch<V, Opts> :
          Kind extends 'preminor' ? IncPreminor<V, Opts> :
            Kind extends 'premajor' ? IncPremajor<V, Opts> :
              Kind extends 'prerelease' ? IncPrerelease<V, Opts> :
                Kind extends 'release' ? Release<V, OptKeep<Opts>> :
                  never
