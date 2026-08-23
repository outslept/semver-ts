import type { IsNonEmpty } from "./nonempty";
import type { IsDigits } from "./digits";

export type StartsWithZero<S extends string> = S extends `0${string}` ? true : false;

export type NoLeadingZero<S extends string> = S extends "0"
  ? true
  : StartsWithZero<S> extends true
  ? false
  : true;

export type IsNumericId<S extends string> =
  IsNonEmpty<S> extends true ? (IsDigits<S> extends true ? NoLeadingZero<S> : false) : false;

export type IsNumericIdLoose<S extends string> =
  IsNonEmpty<S> extends true
  ? (IsDigits<S> extends true ? true : false)
  : : false
