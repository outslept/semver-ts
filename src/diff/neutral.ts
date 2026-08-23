import type { SemverDiff } from "./public";

export type SemverDiffNeutral<A extends string, B extends string> =
  SemverDiff<A, B> extends infer K
    ? K extends "downgrade"
      ? SemverDiff<B, A>
      : K extends "build" | "none"
        ? null
        : K
    : never;
