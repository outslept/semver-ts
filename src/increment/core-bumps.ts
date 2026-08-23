import type { ParseSemver } from "../parser";
import type { BuildToStr } from "./build";
import type { IncNumStr } from "./num";

export type NextPatch<V extends string> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
  }
    ? `${A}.${B}.${IncNumStr<C>}`
    : never;

export type NextMinor<V extends string> =
  ParseSemver<V> extends { major: infer A extends string; minor: infer B extends string }
    ? `${A}.${IncNumStr<B>}.0`
    : never;

export type NextMajor<V extends string> =
  ParseSemver<V> extends { major: infer A extends string } ? `${IncNumStr<A>}.0.0` : never;

export type NextPatchKeepBuild<V extends string> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    patch: infer C extends string;
    build: infer BD extends string[];
  }
    ? BD extends []
      ? `${A}.${B}.${IncNumStr<C>}`
      : `${A}.${B}.${IncNumStr<C>}+${BuildToStr<BD>}`
    : never;

export type NextMinorKeepBuild<V extends string> =
  ParseSemver<V> extends {
    major: infer A extends string;
    minor: infer B extends string;
    build: infer BD extends string[];
  }
    ? BD extends []
      ? `${A}.${IncNumStr<B>}.0`
      : `${A}.${IncNumStr<B>}.0+${BuildToStr<BD>}`
    : never;

export type NextMajorKeepBuild<V extends string> =
  ParseSemver<V> extends { major: infer A extends string; build: infer BD extends string[] }
    ? BD extends []
      ? `${IncNumStr<A>}.0.0`
      : `${IncNumStr<A>}.0.0+${BuildToStr<BD>}`
    : never;
