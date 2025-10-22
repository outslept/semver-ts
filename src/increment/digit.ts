import type { Digit } from '../char'

export type SuccDigit<D extends Digit> =
  D extends '0' ? '1' : D extends '1' ? '2' : D extends '2' ? '3' : D extends '3' ? '4' :
    D extends '4' ? '5' : D extends '5' ? '6' : D extends '6' ? '7' : D extends '7' ? '8' :
      D extends '8' ? '9' : '0'
