export type CmpLen<A extends string, B extends string> =
  A extends ''
    ? (B extends '' ? 0 : -1)
    : (B extends ''
        ? 1
        : (A extends `${infer _A}${infer RA}`
            ? (B extends `${infer _B}${infer RB}` ? CmpLen<RA, RB> : never)
            : never))
