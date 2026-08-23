import type { CharRank } from "../char";
import type { CmpRank } from "./rank";

export type CmpChar<A extends string, B extends string> =
  CharRank<A> extends infer RA
    ? RA extends [number, number]
      ? CharRank<B> extends infer RB
        ? RB extends [number, number]
          ? CmpRank<RA, RB>
          : never
        : never
      : never
    : never;
