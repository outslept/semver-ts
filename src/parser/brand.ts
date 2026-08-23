import type { IsValidSemver } from "./semver";
import type { ParserMode } from "./mode";

export type Semver<S extends string, M extends ParserMode = "strict"> =
  IsValidSemver<S, M> extends true ? S & { __semver: true } : never;
