export type IndexIn<
  Arr extends readonly string[],
  C extends string,
  Acc extends any[] = [],
> = Arr extends readonly [infer H extends string, ...infer T extends string[]]
  ? C extends H
    ? Acc["length"]
    : IndexIn<T, C, [...Acc, unknown]>
  : never;
