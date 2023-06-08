import { InsufficientFundsError } from '../types'
import { parseInsufficientFunds } from './parseInsufficientFunds'

export const handleBroadcastError = (broadcastError: string): [Error, InsufficientFundsError | undefined] => {
  const notEnoughFunds = 'InsufficientFunds'

  if (broadcastError.includes(notEnoughFunds)) {
    const cause = parseInsufficientFunds(broadcastError)

    return [new Error('INSUFFICIENT_FUNDS'), cause]
  }
  return [new Error(broadcastError), undefined]
}
