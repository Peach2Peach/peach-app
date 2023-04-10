import { getError } from './getError'
import { getOk } from './getOk'
import { Result } from './types'

export const getResult = <R, E>(result?: R, error?: E): Result<R, E> => {
  const isOk = !!result && !error
  if (isOk) return getOk(result)

  return getError(error, result)
}
