import type { IsDigit } from "../char";

export type IsDigits<S extends string> = S extends `${infer C}${infer R}`
  ? IsDigit<C> extends true
    ? IsDigits<R>
    : false
  : true;
