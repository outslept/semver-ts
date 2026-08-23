import type { CmpLen } from "./len";
import type { CmpStrLex } from "./str";

export type CmpNumStr<A extends string, B extends string> =
  CmpLen<A, B> extends infer L ? (L extends 0 ? CmpStrLex<A, B> : L) : never;
