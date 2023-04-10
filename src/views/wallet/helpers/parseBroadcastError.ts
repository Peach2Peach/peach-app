import { parseError } from '../../../utils/result'
import { InsufficientFundsError } from '../../../utils/wallet/types'

const isInsufficientFundsError = (cause: any): cause is InsufficientFundsError => cause && 'needed' in cause

export const parseBroadcastError = (e: Error, cause: string | InsufficientFundsError): string[] => {
  const error = parseError(e)
  if (error === 'FEES_TOO_HIGH') {
    if (typeof cause === 'string') {
      return [cause]
    }
  }
  if (error === 'INSUFFICIENT_FUNDS' && isInsufficientFundsError(cause)) {
    return [cause.needed, cause.available]
  }

  return []
}
