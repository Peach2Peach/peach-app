import { useBitcoinStore } from '../../../store/bitcoinStore'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from './getTxSummary'
import { offerSummary } from '../../../../tests/unit/data/offerSummaryData'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'

jest.mock('../../../utils/offer', () => ({
  getOffer: jest.fn(),
}))
jest.mock('../../../utils/transaction/txIsConfirmed', () => ({
  txIsConfirmed: jest.fn(() => true),
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
  price: undefined,
  currency: undefined,
  date: new Date(1234567890000),
  height: 1,
  confirmed: true,
  offerId: undefined,
  contractId: undefined,
}

describe('getTxSummary', () => {
  beforeEach(() => {
    useBitcoinStore.setState({
      currency: 'USD',
      satsPerUnit: 100000000,
    })
    useWalletState.getState().updateTxOfferMap(txId, offerSummary.id)
    useTradeSummaryStore.getState().setOffers([offerSummary, offerWithContract])
  })

  it('returns transaction summary with offer id', () => {
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerId: offerSummary.id,
      type: 'TRADE',
    })
  })
  it('returns transaction summary with contract id', () => {
    useTradeSummaryStore.getState().setOffers([{ ...offerWithContract, type: 'bid' }])
    useTradeSummaryStore.getState().setContract(contractSummary.id, contractSummary)
    useWalletState.getState().updateTxOfferMap(txId, offerWithContract.id)
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      price: 21,
      currency: 'EUR',
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
    useTradeSummaryStore.getState().setOffers([{ ...offerWithContract, type: 'ask' }])
    useTradeSummaryStore.getState().setContract(contractSummary.id, contractSummary)
    useWalletState.getState().updateTxOfferMap(txId, offerWithContract.id)

    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      price: 21,
      currency: 'EUR',
      offerId: offerWithContract.id,
      contractId: contractSummary.id,
      type: 'REFUND',
    })
  })
  it('returns the correct transaction summary object for a deposit', () => {
    // @ts-ignore
    useWalletState.getState().updateTxOfferMap(txId, undefined)

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
