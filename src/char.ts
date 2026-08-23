export type DashArr = ["-"];
export type DigitsArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export type UppersArr = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
export type LowersArr = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export type Dash = DashArr[number];
export type Digit = DigitsArr[number];
export type Upper = UppersArr[number];
export type Lower = LowersArr[number];
export type Letter = Upper | Lower;
export type AlphaNumDash = Letter | Digit | Dash;

export type IndexIn<
  Arr extends readonly string[],
  C extends string,
  Acc extends unknown[] = [],
> = Arr extends readonly [infer H extends string, ...infer T extends string[]]
  ? C extends H
    ? Acc["length"]
    : IndexIn<T, C, [...Acc, unknown]>
  : never;

export type IsDigit<C extends string> = C extends Digit ? true : false;
export type IsUpper<C extends string> = C extends Upper ? true : false;
export type IsLower<C extends string> = C extends Lower ? true : false;
export type IsLetter<C extends string> = C extends Letter ? true : false;
export type IsDash<C extends string> = C extends Dash ? true : false;
export type IsAlphaNumDash<C extends string> = C extends AlphaNumDash ? true : false;

export type CharCategory<C extends string> = C extends Dash
  ? 0
  : C extends Digit
    ? 1
    : C extends Upper
      ? 2
      : C extends Lower
        ? 3
        : never;

export type CharRank<C extends string> = C extends Dash
  ? [0, 0]
  : C extends Digit
    ? [1, IndexIn<DigitsArr, C>]
    : C extends Upper
      ? [2, IndexIn<UppersArr, C>]
      : C extends Lower
        ? [3, IndexIn<LowersArr, C>]
        : never;
