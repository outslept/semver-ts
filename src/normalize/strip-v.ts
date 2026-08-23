export type StripVPrefix<S extends string> = S extends `v${infer R}`
  ? R
  : S extends `V${infer R2}`
    ? R2
    : S;
