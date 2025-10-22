export type BuildToStr<B extends string[]> =
  B extends [infer H extends string, ...infer T extends string[]]
    ? (T extends [] ? H : `${H}.${BuildToStr<T>}`)
    : ''
