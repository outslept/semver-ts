import type { PreId } from "../parser";
import type { CmpNumStr } from "./numstr";
import type { CmpStrLex } from "./str";

export type CmpPreId<A extends PreId, B extends PreId> = A extends {
  kind: "num";
  v: infer VA extends string;
}
  ? B extends { kind: "num"; v: infer VB extends string }
    ? CmpNumStr<VA, VB>
    : -1
  : B extends { kind: "num" }
    ? 1
    : A extends { kind: "str"; v: infer SA extends string }
      ? B extends { kind: "str"; v: infer SB extends string }
        ? CmpStrLex<SA, SB>
        : never
      : never;

export type CmpPre<A extends PreId[], B extends PreId[]> = A extends [
  infer HA extends PreId,
  ...infer TA extends PreId[],
]
  ? B extends [infer HB extends PreId, ...infer TB extends PreId[]]
    ? CmpPreId<HA, HB> extends 0
      ? CmpPre<TA, TB>
      : CmpPreId<HA, HB>
    : 1
  : B extends []
    ? 0
    : -1;
