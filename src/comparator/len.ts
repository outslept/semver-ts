export type CmpLen<A extends string, B extends string> =
  A extends `${string}${infer RA}`
    ? (B extends `${string}${infer RB}` ? CmpLen<RA, RB> : 1)
    : (B extends '' ? 0 : -1)
