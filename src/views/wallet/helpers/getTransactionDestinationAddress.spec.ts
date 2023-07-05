import { bitcoinTransaction, transactionWithRBF2 } from '../../../../tests/unit/data/transactionDetailData'
import { getTransactionDestinationAddress } from './getTransactionDestinationAddress'

/**
 * note that this is a temporary naive way to determine the destination address
 * when bdk-rn supports `wallet.is_mine(address: string)` method
 * this function needs to be restructured to check if the tx is incoming our outgoing
 * and depending on that use or ignore is_mine
 *
 * Also, when peach wallet supports payout to multiple wallets, this method needs to be replaced
 * by a method that returns an array of addresses.
 */
describe('getTransactionDestinationAddress', () => {
  it('returns the correct address for a trade', () => {
    expect(getTransactionDestinationAddress('TRADE', transactionWithRBF2)).toEqual(
      'bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt',
    )
  })
  it('returns the correct address for a funded escrow', () => {
    expect(getTransactionDestinationAddress('ESCROWFUNDED', bitcoinTransaction)).toEqual('bc1qxukhredacted')
  })

  it('returns the correct address for a refund', () => {
    expect(getTransactionDestinationAddress('REFUND', transactionWithRBF2)).toEqual(
      'bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt',
    )
  })

  it('returns the correct address for a withdrawal', () => {
    expect(getTransactionDestinationAddress('WITHDRAWAL', transactionWithRBF2)).toEqual(
      '1B5BPUZGErrCzDPPWc7Hs6vyHW81CmVpdN',
    )
  })

  it('returns the correct address for a deposit', () => {
    expect(getTransactionDestinationAddress('DEPOSIT', transactionWithRBF2)).toEqual(
      'bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt',
    )
  })
})
