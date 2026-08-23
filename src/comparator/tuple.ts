export type Tup<N extends number, R extends any[] = []> = R["length"] extends N
  ? R
  : Tup<N, [...R, unknown]>;
