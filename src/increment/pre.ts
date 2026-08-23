import type { ParseSemver, PreId } from "../parser";
import type { IsAlphaNumDashToken } from "../string";
import type { BuildToStr } from "./build";
import type { NextPreTokens, PreIdsToStr } from "./pre-internals";
import type { IncNumStr } from "./num";

export type NextPre<V extends string, Tag extends string> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
    pre: infer P extends PreId[];
  }
    ? NextPreTokens<P, Tag> extends infer OUT extends PreId[]
      ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
      : never
    : never;

export type NextPreSafe<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
      }
      ? NextPreTokens<P, Tag> extends infer OUT extends PreId[]
        ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
        : never
      : never
    : never;

export type NextPreKeepBuild<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
        build: infer BD extends string[];
      }
      ? NextPreTokens<P, Tag> extends infer OUT extends PreId[]
        ? BD extends []
          ? `${A}.${B}.${C}-${PreIdsToStr<OUT>}`
          : `${A}.${B}.${C}-${PreIdsToStr<OUT>}+${BuildToStr<BD>}`
        : never
      : never
    : never;

export type Prepatch<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        patch: infer C extends string;
        pre: infer P extends PreId[];
      }
      ? P extends []
        ? `${A}.${B}.${IncNumStr<C>}-${Tag}.1`
        : NextPreSafe<V, Tag>
      : never
    : never;

export type Preminor<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string }
      ? `${A}.${IncNumStr<B>}.0-${Tag}.1`
      : never
    : never;

export type Premajor<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends { major: infer A extends string }
      ? `${IncNumStr<A>}.0.0-${Tag}.1`
      : never
    : never;

export type PrepatchKeepBuild<V extends string, Tag extends string> =
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
          ? `${A}.${B}.${IncNumStr<C>}-${Tag}.1`
          : `${A}.${B}.${IncNumStr<C>}-${Tag}.1+${BuildToStr<BD>}`
        : NextPreKeepBuild<V, Tag>
      : never
    : never;

export type PreminorKeepBuild<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends {
        major: infer A extends string;
        minor: infer B extends string;
        build: infer BD extends string[];
      }
      ? BD extends []
        ? `${A}.${IncNumStr<B>}.0-${Tag}.1`
        : `${A}.${IncNumStr<B>}.0-${Tag}.1+${BuildToStr<BD>}`
      : never
    : never;

export type PremajorKeepBuild<V extends string, Tag extends string> =
  IsAlphaNumDashToken<Tag> extends true
    ? ParseSemver<V> extends { major: infer A extends string; build: infer BD extends string[] }
      ? BD extends []
        ? `${IncNumStr<A>}.0.0-${Tag}.1`
        : `${IncNumStr<A>}.0.0-${Tag}.1+${BuildToStr<BD>}`
      : never
    : never;
