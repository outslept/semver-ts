export type PreNum<V extends string = string> = { kind: 'num'; v: V }
export type PreStr<V extends string = string> = { kind: 'str'; v: V }
export type PreId<V extends string = string> = PreNum<V> | PreStr<V>
