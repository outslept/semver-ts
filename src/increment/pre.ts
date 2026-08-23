import type { ParseSemver, PreId } from "../parser";
import type { IsAlphaNumDashToken } from "../string";
import type { BuildToStr } from "./build";
import type { NextPreTokens, PreIdsToStr } from "./pre-internals";
import type { IncNumStr } from "./num";

type BaseSuffix<B extends 0 | 1 | false> = B extends 1 ? ".1" : B extends 0 ? ".0" : "";

export type NextPre<V extends string, Tag extends string, Base extends 0 | 1 | false = 1> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
    pre: infer P extends PreId[];
  }
    ? NextPreTokens<P, Tag, Base> extends infer OUT extends PreId[]
      ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
      : never
    : never;

export type NextPreSafe<V extends string, Tag extends string, Base extends 0 | 1 | false = 1> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
      }
      ? NextPreTokens<P, Tag, Base> extends infer OUT extends PreId[]
        ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
        : never
      : never
    : never;

export type NextPreKeepBuild<V extends string, Tag extends string, Base extends 0 | 1 | false = 1> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
        build: infer BD extends string[];
      }
      ? NextPreTokens<P, Tag, Base> extends infer OUT extends PreId[]
        ? BD extends []
          ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
          : `${A}.${B}.${C}-${PreIdsToStr<OUT>}+${BuildToStr<BD>}`
        : never
      : never
    : never;

export type Prepatch<V extends string, Tag extends string, Base extends 0 | 1 | false = 1> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
      }
      ? P extends []
        ? `${A}.${B}.${IncNumStr<C>}-${Tag}${BaseSuffix<Base>}`
        : NextPreSafe<V, Tag, Base>
      : never
    : never;

export type Preminor<V extends string, Tag extends string, Base extends 0 | 1 | false = 1> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string }
      ? `${A}.${IncNumStr<B>}.0-${Tag}${BaseSuffix<Base>}`
      : never
    : never;

export type Premajor<V extends string, Tag extends string, Base extends 0 | 1 | false = 1> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends { major: infer A extends string }
      ? `${IncNumStr<A>}.0.0-${Tag}${BaseSuffix<Base>}`
      : never
    : never;

export type PrepatchKeepBuild<
  V extends string,
  Tag extends string,
  Base extends 0 | 1 | false = 1,
> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
        build: infer BD extends string[];
      }
      ? P extends []
        ? BD extends []
          ? `${A}.${B}.${IncNumStr<C>}-${Tag}${BaseSuffix<Base>}`
          : `${A}.${B}.${IncNumStr<C>}-${Tag}${BaseSuffix<Base>}+${BuildToStr<BD>}`
        : NextPreKeepBuild<V, Tag, Base>
      : never
    : never;

export type PreminorKeepBuild<
  V extends string,
  Tag extends string,
  Base extends 0 | 1 | false = 1,
> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        build: infer BD extends string[];
      }
      ? BD extends []
        ? `${A}.${IncNumStr<B>}.0-${Tag}${BaseSuffix<Base>}`
        : `${A}.${IncNumStr<B>}.0-${Tag}${BaseSuffix<Base>}+${BuildToStr<BD>}`
      : never
    : never;

export type PremajorKeepBuild<
  V extends string,
  Tag extends string,
  Base extends 0 | 1 | false = 1,
> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends { major: infer A extends string; build: infer BD extends string[] }
      ? BD extends []
        ? `${IncNumStr<A>}.0.0-${Tag}${BaseSuffix<Base>}`
        : `${IncNumStr<A>}.0.0-${Tag}${BaseSuffix<Base>}+${BuildToStr<BD>}`
      : never
    : never;
