export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
    ? true
    : false;

export type Not<A extends boolean> = A extends true ? false : true;

export type Eq<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

export type SplitBy<S extends string, Sep extends string> = Sep extends ""
  ? [S]
  : S extends ""
    ? []
    : S extends `${infer H}${Sep}${infer T}`
      ? [H, ...SplitBy<T, Sep>]
      : [S];

export type JoinBy<Ts extends string[], Sep extends string> = Ts extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? T extends []
    ? H
    : `${H}${Sep}${JoinBy<T, Sep>}`
  : "";
