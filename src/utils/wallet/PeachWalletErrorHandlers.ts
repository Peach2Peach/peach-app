import { Result } from '@synonymdev/result'
import { InsufficientFundsError } from './types'

export class PeachWalletErrorHandlers {
  static handleBroadcastError (broadcastError: Result<string>, feeRate?: number): Error {
    if (broadcastError.isOk()) return Error('no error')

    const feesTooHigh = 'Sum of UTXO spendable values does not fit into u64'
    const notEnoughFunds = 'InsufficientFunds'

    if (broadcastError.error.message.includes(feesTooHigh)) {
      return Error('FEES_TOO_HIGH', { cause: String(feeRate) })
    }
    if (broadcastError.error.message.includes(notEnoughFunds)) {
      const cause = broadcastError.error.message.match(/needed: (?<needed>\d+), available: (?<available>\d+)/u)
        ?.groups || {
        needed: 'unknown',
        available: 'unknown',
      }
      return Error('INSUFFICIENT_FUNDS', { cause: cause as InsufficientFundsError })
    }
    return broadcastError.error
  }
}
