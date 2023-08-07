import { confirmed1 } from '../../../tests/unit/data/transactionDetailData'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { mapTransactionToOffer } from './mapTransactionToOffer'
import { useWalletState } from './walletStore'

describe('mapTransactionToOffer', () => {
  afterEach(() => {
    useTradeSummaryStore.getState().reset()
    useWalletState.getState().reset()
  })

  it('maps transaction to sell offer id', () => {
    useTradeSummaryStore.getState().setOffer('2', { id: '2', fundingTxId: confirmed1.txid })
    mapTransactionToOffer(confirmed1)
    expect(useWalletState.getState().txOfferMap).toEqual({ txid1: '2' })
  })
  it('maps transaction to buy offer id', () => {
    useTradeSummaryStore.getState().setContract('1-3', { id: '1-3', releaseTxId: confirmed1.txid })
    useTradeSummaryStore.getState().setOffer('3', { id: '3' })
    mapTransactionToOffer(confirmed1)
    expect(useWalletState.getState().txOfferMap).toEqual({ txid1: '3' })
  })
  it('does not map transaction if no offer can be associated with it', () => {
    mapTransactionToOffer(confirmed1)
    expect(useWalletState.getState().txOfferMap).toEqual({})
  })
})