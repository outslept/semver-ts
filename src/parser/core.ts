import type { IsNumericId } from '../string'

export type ParseCore<S extends string> =
  S extends `${infer A}.${infer R1}`
    ? R1 extends `${infer B}.${infer C}`
      ? IsNumericId<A> extends true
        ? IsNumericId<B> extends true
          ? IsNumericId<C> extends true
            ? { major: A; minor: B; patch: C }
            : never
          : never
        : never
      : never
    : never

export type IsValidCore<S extends string> =
  ParseCore<S> extends never ? false : true

export type MajorOf<S extends string> =
  ParseCore<S> extends { major: infer M extends string } ? M : never

export type MinorOf<S extends string> =
  ParseCore<S> extends { minor: infer M extends string } ? M : never

export type PatchOf<S extends string> =
  ParseCore<S> extends { patch: infer P extends string } ? P : never
