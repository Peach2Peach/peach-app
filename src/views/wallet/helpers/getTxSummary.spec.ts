import { bitcoinStore } from '../../../store/bitcoinStore'
import { tradeSummaryStore } from '../../../store/tradeSummaryStore'
import { walletStore } from '../../../utils/wallet/walletStore'
import { getTxSummary } from './getTxSummary'
import { offerSummary } from '../../../../tests/unit/data/offerSummaryData'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'

const txIsConfirmedMock = jest.fn().mockReturnValue(true)
jest.mock('../../../utils/transaction/txIsConfirmed', () => ({
  txIsConfirmed: (...args: any[]) => txIsConfirmedMock(...args),
}))

jest.mock('../../../utils/offer', () => ({
  getOffer: jest.fn(),
}))

const offerWithContract = { ...offerSummary, id: 'offerWithContract', contractId: contractSummary.id }
const txId = '123'
const baseTx = {
  txid: txId,
  received: 0,
  sent: 0,
  confirmationTime: {
    height: 1,
    timestamp: 1234567890,
  },
}
const receivedTx = { ...baseTx, received: 100000000 }
const sentTx = { ...baseTx, sent: 100000000 }
const baseSummary = {
  id: '123',
  amount: 100000000,
  price: 1,
  currency: 'USD',
  date: new Date(1234567890000),
  confirmed: true,
  offerId: undefined,
  contractId: undefined,
}
describe('getTxSummary', () => {
  beforeEach(() => {
    bitcoinStore.setState({ currency: 'USD', price: 1, satsPerUnit: 100000000 })
    walletStore.getState().updateTxOfferMap(txId, offerSummary.id)
    tradeSummaryStore.getState().setOffers([offerSummary, offerWithContract])
    tradeSummaryStore.getState().setContracts([contractSummary])
  })
  it('returns transaction summary with offer id', () => {
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerId: offerSummary.id,
      type: 'TRADE',
    })
  })
  it('returns transaction summary with contract id', () => {
    walletStore.getState().updateTxOfferMap(txId, offerWithContract.id)
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerId: offerWithContract.id,
      contractId: contractSummary.id,
      type: 'TRADE',
    })
  })
  it('returns the correct transaction summary object for a confirmed trade', () => {
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerId: offerSummary.id,
      type: 'TRADE',
    })
  })

  it('returns the correct transaction summary object for a refund', () => {
    tradeSummaryStore.getState().setOffers([{ ...offerWithContract, type: 'ask' }])
    walletStore.getState().updateTxOfferMap(txId, offerWithContract.id)

    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerId: offerWithContract.id,
      contractId: contractSummary.id,
      type: 'REFUND',
    })
  })
  it('returns the correct transaction summary object for a deposit', () => {
    // @ts-ignore
    walletStore.getState().updateTxOfferMap(txId, undefined)

    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      type: 'DEPOSIT',
    })
  })
  it('returns the correct transaction summary object for a withdrawal', () => {
    expect(getTxSummary(sentTx)).toEqual({
      ...baseSummary,
      offerId: '456',
      type: 'WITHDRAWAL',
    })
  })
})
