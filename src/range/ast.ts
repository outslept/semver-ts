import type { PreId } from "../parser.js";

export type Wild = "x" | "X" | "*";

export type CmpOp = "=" | ">" | ">=" | "<" | "<=";

export type PartialCore = {
  major: string | "x";
  minor?: string | "x";
  patch?: string | "x";
};

export type PartialSemver = {
  core: PartialCore;
  pre?: PreId[];
  build?: string[];
};

export type ComparatorNode = { t: "cmp"; op: CmpOp; v: PartialSemver };
export type TildeNode = { t: "tilde"; v: PartialSemver };
export type CaretNode = { t: "caret"; v: PartialSemver };
export type HyphenNode = { t: "hy"; left: PartialSemver; right: PartialSemver };

export type RangeNode = ComparatorNode | TildeNode | CaretNode | HyphenNode;

export type ComparatorSet = { t: "and"; nodes: RangeNode[] };

export type RangeAST = ComparatorSet[];
