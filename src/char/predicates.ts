import type { Digit, Upper, Lower, Letter, Dash, AlphaNumDash } from './tokens'

export type IsDigit<C extends string> = C extends Digit ? true : false
export type IsUpper<C extends string> = C extends Upper ? true : false
export type IsLower<C extends string> = C extends Lower ? true : false
export type IsLetter<C extends string> = C extends Letter ? true : false
export type IsDash<C extends string> = C extends Dash ? true : false
export type IsAlphaNumDash<C extends string> = C extends AlphaNumDash ? true : false
