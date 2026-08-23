import type { PreId } from "../parser";
import type { ParseCore } from "../parser/core";
import type { ParsePre } from "../parser/pre";
import type { ParseBuild } from "../parser/build";

export type SemverDebugReason = "INVALID_CORE" | "INVALID_PRE" | "INVALID_BUILD";

export type ParseSemverDebug<S extends string> = S extends `${infer Left}+${infer Build}`
  ? Left extends string
    ? Build extends string
      ? Left extends `${infer Core}-${infer Pre}`
        ? ParseCore<Core> extends infer C
          ? C extends {
              major: infer A extends string;
              minor: infer B extends string;
              patch: infer P extends string;
            }
            ? ParsePre<Pre> extends infer PR
              ? PR extends PreId[]
                ? ParseBuild<Build> extends infer BD
                  ? BD extends string[]
                    ? { ok: true; value: { major: A; minor: B; patch: P; pre: PR; build: BD } }
                    : { ok: false; reason: "INVALID_BUILD" }
                  : never
                : { ok: false; reason: "INVALID_PRE" }
              : never
            : { ok: false; reason: "INVALID_CORE" }
          : never
        : ParseCore<Left> extends infer C2
          ? C2 extends {
              major: infer A2 extends string;
              minor: infer B2 extends string;
              patch: infer P2 extends string;
            }
            ? ParseBuild<Build> extends infer BD2
              ? BD2 extends string[]
                ? { ok: true; value: { major: A2; minor: B2; patch: P2; pre: []; build: BD2 } }
                : { ok: false; reason: "INVALID_BUILD" }
              : never
            : { ok: false; reason: "INVALID_CORE" }
          : never
      : never
    : never
  : S extends `${infer Left2}-${infer Pre2}`
    ? ParseCore<Left2> extends infer C3
      ? C3 extends {
          major: infer A3 extends string;
          minor: infer B3 extends string;
          patch: infer P3 extends string;
        }
        ? ParsePre<Pre2> extends infer PR3
          ? PR3 extends PreId[]
            ? { ok: true; value: { major: A3; minor: B3; patch: P3; pre: PR3; build: [] } }
            : { ok: false; reason: "INVALID_PRE" }
          : never
        : { ok: false; reason: "INVALID_CORE" }
      : never
    : ParseCore<S> extends infer C4
      ? C4 extends {
          major: infer A4 extends string;
          minor: infer B4 extends string;
          patch: infer P4 extends string;
        }
        ? { ok: true; value: { major: A4; minor: B4; patch: P4; pre: []; build: [] } }
        : { ok: false; reason: "INVALID_CORE" }
      : never;
