import { ConfirmedTransaction } from 'bdk-rn/lib/lib/interfaces'
import { bitcoinStore } from '../../../store/bitcoinStore'
import { tradeSummaryStore } from '../../../store/tradeSummaryStore'
import { walletStore } from '../../../utils/wallet/walletStore'
import { getTxSummary } from './getTxSummary'
import { offerSummary } from '../../../../tests/unit/data/offerSummaryData'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'

const txIsConfirmedMock = jest.fn().mockReturnValue(true)
jest.mock('../../../utils/transaction', () => ({
  ...jest.requireActual('../../../utils/transaction'),
  txIsConfirmed: (...args: any[]) => txIsConfirmedMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('getTxSummary', () => {
  const offerWithContract = { ...offerSummary, id: 'offerWithContract', contractId: contractSummary.id }
  const txId = '123'
  const baseTx: Partial<ConfirmedTransaction> = {
    txid: txId,
    received: 0,
    sent: 0,
    block_timestamp: 1234567890,
  }
  const receivedTx: Partial<ConfirmedTransaction> = { ...baseTx, received: 100000000 }
  const sentTx: Partial<ConfirmedTransaction> = { ...baseTx, sent: 100000000 }
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
  beforeEach(() => {
    bitcoinStore.getState().setCurrency('USD')
    bitcoinStore.getState().setPrice(1)
    bitcoinStore.getState().setSatsPerUnit(100000000)
    walletStore.getState().updateTxOfferMap(txId, offerSummary.id)
    tradeSummaryStore.getState().setOffers([offerSummary, offerWithContract])
    tradeSummaryStore.getState().setContracts([contractSummary])
  })
  it('returns transaction summary with offer id', () => {
    expect(getTxSummary(receivedTx as ConfirmedTransaction)).toEqual({
      ...baseSummary,
      offerId: offerSummary.id,
      type: 'TRADE',
    })
  })
  it('returns transaction summary with contract id', () => {
    walletStore.getState().updateTxOfferMap(txId, offerWithContract.id)
    expect(getTxSummary(receivedTx as ConfirmedTransaction)).toEqual({
      ...baseSummary,
      offerId: offerWithContract.id,
      contractId: contractSummary.id,
      type: 'TRADE',
    })
  })
  it('returns the correct transaction summary object for a confirmed trade', () => {
    expect(getTxSummary(receivedTx as ConfirmedTransaction)).toEqual({
      ...baseSummary,
      offerId: offerSummary.id,
      type: 'TRADE',
    })
  })

  it('returns the correct transaction summary object for a refund', () => {
    tradeSummaryStore.getState().setOffers([{ ...offerWithContract, type: 'ask' }])
    walletStore.getState().updateTxOfferMap(txId, offerWithContract.id)

    expect(getTxSummary(receivedTx as ConfirmedTransaction)).toEqual({
      ...baseSummary,
      offerId: offerWithContract.id,
      contractId: contractSummary.id,
      type: 'REFUND',
    })
  })
  it('returns the correct transaction summary object for a deposit', () => {
    // @ts-ignore
    walletStore.getState().updateTxOfferMap(txId, undefined)

    expect(getTxSummary(receivedTx as ConfirmedTransaction)).toEqual({
      ...baseSummary,
      type: 'DEPOSIT',
    })
  })
  it('returns the correct transaction summary object for a withdrawal', () => {
    expect(getTxSummary(sentTx as ConfirmedTransaction)).toEqual({
      ...baseSummary,
      offerId: '456',
      type: 'WITHDRAWAL',
    })
  })
})
