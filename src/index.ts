export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
export type Upper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
export type Lower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
export type Letter = Upper | Lower
export type Dash = '-'
export type AlphaNumDash = Letter | Digit | Dash

export type IsDigit<C extends string> = C extends Digit ? true : false
export type IsUpper<C extends string> = C extends Upper ? true : false
export type IsLower<C extends string> = C extends Lower ? true : false
export type IsLetter<C extends string> = C extends Letter ? true : false
export type IsDash<C extends string> = C extends Dash ? true : false
export type IsAlphaNumDash<C extends string> = C extends AlphaNumDash ? true : false

export type DigitsArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
export type UppersArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export type LowersArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

export type IndexIn<
  Arr extends readonly string[],
  C extends string,
  Acc extends any[] = []
> = Arr extends readonly [infer H extends string, ...infer T extends string[]]
  ? (C extends H ? Acc['length'] : IndexIn<T, C, [...Acc, unknown]>)
  : never

export type CharCategory<C extends string> =
  C extends Dash ? 0 :
    C extends Digit ? 1 :
      C extends Upper ? 2 :
        C extends Lower ? 3 :
          never

export type CharRank<C extends string> =
  C extends Dash ? [0, 0] :
    C extends Digit ? [1, IndexIn<DigitsArr, C>] :
      C extends Upper ? [2, IndexIn<UppersArr, C>] :
        C extends Lower ? [3, IndexIn<LowersArr, C>] :
          never

export type IsDigits<S extends string> =
  S extends `${infer C}${infer R}` ? (IsDigit<C> extends true ? IsDigits<R> : false) : true

export type IsNonEmpty<S extends string> =
    S extends '' ? false : true

export type StartsWithZero<S extends string> =
    S extends `0${string}` ? true : false

export type NoLeadingZero<S extends string> =
    S extends '0' ? true : (StartsWithZero<S> extends true ? false : true)

export type IsNumericId<S extends string> =
    IsNonEmpty<S> extends true
      ? (IsDigits<S> extends true ? NoLeadingZero<S> : false)
      : false

export type ParseCore<S extends string> =
        S extends `${infer A}.${infer R1}`
          ? R1 extends `${infer B}.${infer C}`
            ? IsNumericId<A> extends true
              ? IsNumericId<B> extends true
                ? IsNumericId<C> extends true
                  ? { major: A; minor: B; patch: C }
                  : never
                : never
              : never
            : never
          : never

export type IsValidCore<S extends string> =
            ParseCore<S> extends never ? false : true

export type MajorOf<S extends string> =
            ParseCore<S> extends { major: infer M extends string } ? M : never

export type MinorOf<S extends string> =
            ParseCore<S> extends { minor: infer M extends string } ? M : never

export type PatchOf<S extends string> =
            ParseCore<S> extends { patch: infer P extends string } ? P : never
