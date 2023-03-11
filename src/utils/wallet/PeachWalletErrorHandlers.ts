import { Result } from '@synonymdev/result'
import { InsufficientFundsError } from './types'

export class PeachWalletErrorHandlers {
  static handleBroadcastError (
    broadcastError: Result<string>,
    feeRate?: number,
  ): [Error, string | InsufficientFundsError | undefined] {
    if (broadcastError.isOk()) return [new Error('no error'), undefined]

    const feesTooHigh = 'Sum of UTXO spendable values does not fit into u64'
    const notEnoughFunds = 'InsufficientFunds'

    if (broadcastError.error.message.includes(feesTooHigh)) {
      return [new Error('FEES_TOO_HIGH'), String(feeRate)]
    }
    if (broadcastError.error.message.includes(notEnoughFunds)) {
      const cause = broadcastError.error.message.match(/needed: (?<needed>\d+), available: (?<available>\d+)/u)
        ?.groups || {
        needed: 'unknown',
        available: 'unknown',
      }
      return [new Error('INSUFFICIENT_FUNDS'), cause as InsufficientFundsError]
    }
    return [broadcastError.error, undefined]
  }
}
