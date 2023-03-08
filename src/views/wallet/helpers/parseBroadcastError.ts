import { parseError } from '../../../utils/system'
import { InsufficientFundsError } from '../../../utils/wallet/types'

export const parseBroadcastError = (e: Error): string[] => {
  const error = parseError(e)
  if (error === 'FEES_TOO_HIGH') {
    const cause = (e as Error).cause
    if (typeof cause === 'string') {
      return [cause]
    }
  }
  if (error === 'INSUFFICIENT_FUNDS') {
    const cause = (e as Error).cause as InsufficientFundsError
    return [cause.needed, cause.available]
  }

  return []
}
