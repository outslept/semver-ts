import type { CmpChar } from "./char";

export type CmpStrLex<A extends string, B extends string> = A extends ""
  ? B extends ""
    ? 0
    : -1
  : B extends ""
    ? 1
    : A extends `${infer CA}${infer RA}`
      ? B extends `${infer CB}${infer RB}`
        ? CmpChar<CA, CB> extends 0
          ? CmpStrLex<RA, RB>
          : CmpChar<CA, CB>
        : never
      : never;
