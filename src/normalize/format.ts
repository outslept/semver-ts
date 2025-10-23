import type { ParseSemver, PreId } from '../parser'
import type { JoinBy } from '../utils/str'

type PreIdsToStr<Ps extends PreId[]> =
  Ps extends [infer H extends PreId, ...infer T extends PreId[]]
    ? (T extends [] ? `${H['v']}` : `${H['v']}.${PreIdsToStr<T>}`)
    : ''

export type NormalizeSemver<S extends string> =
  ParseSemver<S> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
    pre: infer P extends PreId[];
    build: infer BD extends string[];
  }
    ? (P extends []
        ? (BD extends []
            ? `${A}.${B}.${C}`
            : `${A}.${B}.${C}+${JoinBy<BD, '.'>}`)
        : (BD extends []
            ? `${A}.${B}.${C}-${PreIdsToStr<P>}`
            : `${A}.${B}.${C}-${PreIdsToStr<P>}+${JoinBy<BD, '.'>}`))
    : never
