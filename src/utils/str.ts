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
