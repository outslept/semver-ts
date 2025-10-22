export type IsNonEmpty<S extends string> =
  S extends '' ? false : true
