import type { IsNumericId, IsNumericIdLoose } from "../string";
import type { ParserMode } from "./mode";

type CheckNumeric<S extends string, M extends ParserMode> = M extends "loose"
  ? IsNumericIdLoose<S> extends true
    ? true
    : false
  : IsNumericId<S> extends true
    ? true
    : false;

export type ParseCore<
  S extends string,
  M extends ParserMode = "strict",
> = S extends `${infer A}.${infer R1} `
  ? R1 extends `${infer B}.${infer C} `
    ? CheckNumeric<A, M> extends true
      ? CheckNumeric<B, M> extends true
        ? CheckNumeric<C, M> extends true
          ? { major: A; minor: B; patch: C }
          : never
        : never
      : never
    : never
  : never;

export type IsValidCore<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends never ? false : true;

export type MajorOf<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends { major: infer X extends string } ? X : never;

export type MinorOf<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends { minor: infer X extends string } ? X : never;

export type PatchOf<S extends string, M extends ParserMode = "strict"> =
  ParseCore<S, M> extends { patch: infer X extends string } ? X : never;
