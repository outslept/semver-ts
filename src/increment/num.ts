import type { Digit } from "../char.js";
import type { SuccDigit } from "./digit.js";

export type IncNumStrCarry<S extends string> = S extends ""
  ? "1"
  : S extends `${infer R}${infer D extends Digit}`
    ? D extends "9"
      ? `${IncNumStrCarry<R>}0`
      : `${R}${SuccDigit<D>}`
    : never;

export type IncNumStr<S extends string> = S extends `${infer R}${infer D extends Digit}`
  ? D extends "9"
    ? `${IncNumStrCarry<R>}0`
    : `${R}${SuccDigit<D>}`
  : never;
