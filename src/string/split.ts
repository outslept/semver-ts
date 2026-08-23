export type SplitDotsNonEmpty<S extends string> = S extends ""
  ? never
  : S extends `${infer H}.${infer T}`
    ? H extends ""
      ? never
      : SplitDotsNonEmpty<T> extends infer R
        ? R extends string[]
          ? [H, ...R]
          : never
        : never
    : S extends ""
      ? never
      : [S];
