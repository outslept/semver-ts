import type { PreId } from '../parser'
import type { Not } from './bool'

export type PreEmpty<P extends PreId[]> = P extends [] ? true : false
export type PreNonEmpty<P extends PreId[]> = Not<PreEmpty<P>>
