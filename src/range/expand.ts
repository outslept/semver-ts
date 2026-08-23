import type { BuildToStr } from "../increment/build.js";
import type { NextMajor, NextMinor, NextPatch } from "../increment/core-bumps.js";
import type { PreIdsToStr } from "../increment/pre-internals.js";
import type { PreId } from "../parser.js";
import type {
  CaretNode,
  ComparatorNode,
  ComparatorSet,
  HyphenNode,
  PartialCore,
  PartialSemver,
  RangeAST,
  RangeNode,
  TildeNode,
} from "./ast.js";

export type NormOp = "=" | ">" | ">=" | "<" | "<=";
export type NormCmp = { op: NormOp; v: string };
export type NormSet = NormCmp[];
export type NormRange = NormSet[];

type IsX<S extends string | "x"> = S extends "x" ? true : false;
type ToNum<S extends string | "x"> = S extends "x" ? "0" : S;

type GetMinor<C extends PartialCore> = C extends { minor: infer M extends string | "x" } ? M : "x";
type GetPatch<C extends PartialCore> = C extends { patch: infer P extends string | "x" } ? P : "x";

type CoreLower<C extends PartialCore> =
  `${ToNum<C["major"]>}.${ToNum<GetMinor<C>>}.${ToNum<GetPatch<C>>}`;

type PreToStr<P> = P extends PreId[] ? (P extends [] ? "" : `-${PreIdsToStr<P>}`) : "";
type BuildToStrOpt<B> = B extends string[] ? (B extends [] ? "" : `+${BuildToStr<B>}`) : "";

type MakeVer<Core extends string, P, B> = `${Core}${PreToStr<P>}${BuildToStrOpt<B>}`;

type PSLower<PS extends PartialSemver> = MakeVer<CoreLower<PS["core"]>, PS["pre"], PS["build"]>;

type HasWildcard<C extends PartialCore> =
  IsX<C["major"]> extends true
    ? true
    : IsX<GetMinor<C>> extends true
      ? true
      : IsX<GetPatch<C>> extends true
        ? true
        : false;

type UpperNextForWildcard<C extends PartialCore> =
  IsX<C["major"]> extends true
    ? never
    : IsX<GetMinor<C>> extends true
      ? NextMajor<`${ToNum<C["major"]>}.0.0`>
      : NextMinor<`${ToNum<C["major"]>}.${ToNum<GetMinor<C>>}.0`>;

type ExpandEqWildcard<PS extends PartialSemver> =
  HasWildcard<PS["core"]> extends true
    ? [UpperNextForWildcard<PS["core"]>] extends [never]
      ? [{ op: ">="; v: "0.0.0" }]
      : UpperNextForWildcard<PS["core"]> extends infer U extends string
        ? [{ op: ">="; v: PSLower<PS> }, { op: "<"; v: U }]
        : [{ op: ">="; v: "0.0.0" }]
    : [{ op: "="; v: PSLower<PS> }];

type ExpandGteWildcard<PS extends PartialSemver> =
  HasWildcard<PS["core"]> extends true
    ? IsX<PS["core"]["major"]> extends true
      ? []
      : [{ op: ">="; v: PSLower<PS> }]
    : [{ op: ">="; v: PSLower<PS> }];

type ExpandGtWildcard<PS extends PartialSemver> =
  HasWildcard<PS["core"]> extends true
    ? [UpperNextForWildcard<PS["core"]>] extends [never]
      ? [{ op: "<"; v: "0.0.0-0" }]
      : UpperNextForWildcard<PS["core"]> extends infer U extends string
        ? [{ op: ">="; v: U }]
        : [{ op: "<"; v: "0.0.0-0" }]
    : [{ op: ">"; v: PSLower<PS> }];

type ExpandLtWildcard<PS extends PartialSemver> =
  HasWildcard<PS["core"]> extends true
    ? IsX<PS["core"]["major"]> extends true
      ? [{ op: "<"; v: "0.0.0-0" }]
      : [{ op: "<"; v: CoreLower<PS["core"]> }]
    : [{ op: "<"; v: PSLower<PS> }];

type ExpandLteWildcard<PS extends PartialSemver> =
  HasWildcard<PS["core"]> extends true
    ? [UpperNextForWildcard<PS["core"]>] extends [never]
      ? []
      : UpperNextForWildcard<PS["core"]> extends infer U extends string
        ? [{ op: "<"; v: U }]
        : []
    : [{ op: "<="; v: PSLower<PS> }];

type ExpandComparatorNode<N extends ComparatorNode> = N["op"] extends "="
  ? ExpandEqWildcard<N["v"]>
  : N["op"] extends ">="
    ? ExpandGteWildcard<N["v"]>
    : N["op"] extends ">"
      ? ExpandGtWildcard<N["v"]>
      : N["op"] extends "<="
        ? ExpandLteWildcard<N["v"]>
        : N["op"] extends "<"
          ? ExpandLtWildcard<N["v"]>
          : never;

type UpperForTilde<C extends PartialCore> =
  IsX<C["major"]> extends true
    ? never
    : IsX<GetMinor<C>> extends true
      ? NextMajor<`${ToNum<C["major"]>}.0.0`>
      : NextMinor<`${ToNum<C["major"]>}.${ToNum<GetMinor<C>>}.0`>;

type ExpandTildeNode<N extends TildeNode> = [UpperForTilde<N["v"]["core"]>] extends [never]
  ? [{ op: ">="; v: "0.0.0" }]
  : UpperForTilde<N["v"]["core"]> extends infer U extends string
    ? [{ op: ">="; v: PSLower<N["v"]> }, { op: "<"; v: U }]
    : [{ op: ">="; v: "0.0.0" }];

type IsZero<S extends string> = S extends "0" ? true : false;

type UpperForCaret<C extends PartialCore> =
  IsX<C["major"]> extends true
    ? never
    : C["major"] extends infer MA extends string
      ? IsZero<MA> extends true
        ? GetMinor<C> extends infer MI extends string | "x"
          ? IsX<MI> extends true
            ? NextMajor<`${MA}.0.0`>
            : MI extends infer MIN extends string
              ? IsZero<MIN> extends true
                ? GetPatch<C> extends infer PA extends string | "x"
                  ? IsX<PA> extends true
                    ? NextMinor<`${MA}.${MIN}.0`>
                    : NextPatch<`${MA}.${MIN}.${PA}`>
                  : never
                : NextMinor<`${MA}.${MIN}.0`>
              : never
          : never
        : NextMajor<`${MA}.0.0`>
      : never;

type ExpandCaretNode<N extends CaretNode> = [UpperForCaret<N["v"]["core"]>] extends [never]
  ? [{ op: ">="; v: "0.0.0" }]
  : UpperForCaret<N["v"]["core"]> extends infer U extends string
    ? [{ op: ">="; v: PSLower<N["v"]> }, { op: "<"; v: U }]
    : [{ op: ">="; v: "0.0.0" }];

type RightIsFull<C extends PartialCore> =
  IsX<GetMinor<C>> extends true ? false : IsX<GetPatch<C>> extends true ? false : true;

type ExpandHyphenNode<N extends HyphenNode> =
  RightIsFull<N["right"]["core"]> extends true
    ? [{ op: ">="; v: PSLower<N["left"]> }, { op: "<="; v: PSLower<N["right"]> }]
    : [UpperNextForWildcard<N["right"]["core"]>] extends [never]
      ? [{ op: ">="; v: "0.0.0" }]
      : UpperNextForWildcard<N["right"]["core"]> extends infer U extends string
        ? [{ op: ">="; v: PSLower<N["left"]> }, { op: "<"; v: U }]
        : [{ op: ">="; v: "0.0.0" }];

type ExpandNode<N extends RangeNode> = N extends ComparatorNode
  ? ExpandComparatorNode<N>
  : N extends TildeNode
    ? ExpandTildeNode<N>
    : N extends CaretNode
      ? ExpandCaretNode<N>
      : N extends HyphenNode
        ? ExpandHyphenNode<N>
        : never;

type Concat<A extends any[], B extends any[]> = [...A, ...B];

type ExpandNodes<Ns extends RangeNode[], Acc extends NormCmp[] = []> = Ns extends [
  infer H extends RangeNode,
  ...infer T extends RangeNode[],
]
  ? ExpandNode<H> extends infer E extends NormCmp[]
    ? ExpandNodes<T, Concat<Acc, E>>
    : never
  : Acc;

type ExpandSet<S extends ComparatorSet> = S["nodes"] extends infer Ns extends RangeNode[]
  ? ExpandNodes<Ns>
  : never;

type MapSets<AST extends RangeAST, Acc extends NormSet[] = []> = AST extends [
  infer H extends ComparatorSet,
  ...infer T extends ComparatorSet[],
]
  ? MapSets<T, [...Acc, ExpandSet<H> & NormSet]>
  : Acc;

export type NormalizeRange<AST extends RangeAST> = MapSets<AST>;
