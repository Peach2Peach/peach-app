import { pending1 } from '../../../../tests/unit/data/transactionDetailData'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { canBumpNetworkFees } from './canBumpNetworkFees'

describe('canBumpNetworkFees', () => {
  // @ts-ignore
  const peachWallet = new PeachWallet({})
  peachWallet.transactions = [pending1]
  const pendingTx: TransactionSummary = {
    amount: 123456,
    price: 100,
    currency: 'EUR',
    date: new Date(),
    confirmed: false,
    id: pending1.txid,
    offerId: '123',
    type: 'TRADE',
  }
  const confirmedTx: TransactionSummary = {
    ...pendingTx,
    confirmed: true,
  }
  it('returns true if transaction is unconfirmed and known to wallet', () => {
    expect(canBumpNetworkFees(peachWallet, pendingTx)).toBeTruthy()
  })
  it('returns false if transaction is confirmed', () => {
    expect(canBumpNetworkFees(peachWallet, confirmedTx)).toBeFalsy()
  })
  it('returns false if transaction is unconfirmed but not known to wallet', () => {
    peachWallet.transactions = []
    expect(canBumpNetworkFees(peachWallet, pendingTx)).toBeFalsy()
  })
})
