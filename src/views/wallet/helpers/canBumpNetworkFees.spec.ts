import {
  confirmedTransactionSummary,
  pending1,
  pendingReceived1,
  pendingReceivedTransactionSummary,
  pendingTransactionSummary,
} from '../../../../tests/unit/data/transactionDetailData'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { canBumpNetworkFees } from './canBumpNetworkFees'

describe('canBumpNetworkFees', () => {
  // @ts-expect-error mock doesn't need args
  const peachWallet = new PeachWallet({})
  peachWallet.transactions = [pending1, pendingReceived1]

  it('returns true if transaction is unconfirmed and known to wallet', () => {
    expect(canBumpNetworkFees(peachWallet, pendingTransactionSummary)).toBeTruthy()
  })
  it('returns false if transaction is confirmed', () => {
    expect(canBumpNetworkFees(peachWallet, confirmedTransactionSummary)).toBeFalsy()
  })
  it('returns false if transaction has no outgoing sats', () => {
    expect(canBumpNetworkFees(peachWallet, pendingReceivedTransactionSummary)).toBeFalsy()
  })
  it('returns false if transaction is unconfirmed but not known to wallet', () => {
    peachWallet.transactions = []
    expect(canBumpNetworkFees(peachWallet, pendingTransactionSummary)).toBeFalsy()
  })
})
