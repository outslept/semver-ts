import type { ParseSemver, PreId } from "../parser";
import type { CmpCore } from "./core";
import type { CmpPre } from "./pre";

export type CmpSemver<A extends string, B extends string> =
  ParseSemver<A> extends infer SA
    ? SA extends { major: string; minor: string; patch: string; pre: PreId[] }
      ? ParseSemver<B> extends infer SB
        ? SB extends { major: string; minor: string; patch: string; pre: PreId[] }
          ? CmpCore<SA, SB> extends infer CC
            ? CC extends 0
              ? SA["pre"] extends []
                ? SB["pre"] extends []
                  ? 0
                  : 1
                : SB["pre"] extends []
                  ? -1
                  : CmpPre<SA["pre"], SB["pre"]>
              : CC
            : never
          : never
        : never
      : never
    : never;
