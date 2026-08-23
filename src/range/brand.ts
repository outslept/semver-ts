import type { ParseRange } from "./parse.js";

export type Range<S extends string> =
  ParseRange<S> extends infer AST ? ([AST] extends [never] ? never : S & { __range: true }) : never;
