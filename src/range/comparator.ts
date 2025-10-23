import type { PreId } from '../parser'
import type { ParsePre } from '../parser/pre'
import type { ParseBuild } from '../parser/build'
import type { IsNumericId } from '../string'
import type { Wild, CmpOp, PartialCore, PartialSemver } from './ast'

type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S
type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S
type Trim<S extends string> = TrimLeft<TrimRight<S>>

type IsWild<T extends string> = T extends Wild ? true : false

type ToIdX<S extends string> =
  IsWild<S> extends true ? 'x' : (IsNumericId<S> extends true ? S : never)

export type ParsePartialCore<S extends string> =
  S extends `${infer A}.${infer R1}`
    ? (R1 extends `${infer B}.${infer C}`
        ? (ToIdX<A> extends infer MA extends string | 'x'
            ? (ToIdX<B> extends infer MI extends string | 'x'
                ? (ToIdX<C> extends infer MP extends string | 'x'
                    ? { major: MA; minor: MI; patch: MP }
                    : never)
                : never)
            : never)
        : (ToIdX<A> extends infer MA2 extends string | 'x'
            ? (ToIdX<R1> extends infer MI2 extends string | 'x'
                ? { major: MA2; minor: MI2 }
                : never)
            : never))
    : (ToIdX<S> extends infer MA3 extends string | 'x' ? { major: MA3 } : never)

type AddPre<PR> = PR extends PreId[] ? { pre: PR } : {}
type AddBuild<BD> = BD extends string[] ? { build: BD } : {}

export type ParsePartialSemver<S extends string> =
  S extends `${infer Left}+${infer Build}`
    ? (ParseBuild<Build> extends infer BD
        ? (BD extends string[]
            ? (Left extends `${infer Core}-${infer Pre}`
                ? (ParsePre<Pre> extends infer PR
                    ? (PR extends PreId[]
                        ? (ParsePartialCore<Core> extends infer PC extends PartialCore
                            ? { core: PC } & AddPre<PR> & AddBuild<BD>
                            : never)
                        : never)
                    : never)
                : (ParsePartialCore<Left> extends infer PC2 extends PartialCore
                    ? { core: PC2 } & AddBuild<BD>
                    : never))
            : never)
        : never)
    : (S extends `${infer Core2}-${infer Pre2}`
        ? (ParsePre<Pre2> extends infer PR2
            ? (PR2 extends PreId[]
                ? (ParsePartialCore<Core2> extends infer PC3 extends PartialCore
                    ? { core: PC3 } & AddPre<PR2>
                    : never)
                : never)
            : never)
        : (ParsePartialCore<S> extends infer PC4 extends PartialCore
            ? { core: PC4 }
            : never))

type MakeCmp<O extends CmpOp, S extends string> =
  ParsePartialSemver<Trim<S>> extends infer V extends PartialSemver ? { t: 'cmp'; op: O; v: V } : never

type MakeTilde<S extends string> =
  ParsePartialSemver<Trim<S>> extends infer V extends PartialSemver ? { t: 'tilde'; v: V } : never

type MakeCaret<S extends string> =
  ParsePartialSemver<Trim<S>> extends infer V extends PartialSemver ? { t: 'caret'; v: V } : never

export type ParseComparator<S extends string> =
  S extends `^${infer VS}` ? MakeCaret<VS> :
    S extends `~${infer VS2}` ? MakeTilde<VS2> :
      S extends `>=${infer V1}` ? MakeCmp<'>=', V1> :
        S extends `<=${infer V2}` ? MakeCmp<'<=', V2> :
          S extends `>${infer V3}` ? MakeCmp<'>', V3> :
            S extends `<${infer V4}` ? MakeCmp<'<', V4> :
              S extends `=${infer V5}` ? MakeCmp<'=', V5> :
                MakeCmp<'=', S>
