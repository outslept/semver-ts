import type { IsValidSemver } from './semver'

export type Semver<S extends string> = IsValidSemver<S> extends true ? S & { __semver: true } : never
