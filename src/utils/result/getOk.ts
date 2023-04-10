import { Ok } from './types'

export const getOk = <R>(result: R): Ok<R> => ({
  result,
  error: undefined,
  getValue: () => result,
  isOk: () => true,
  isError: () => false,
  getError: () => undefined,
})
