import { renderHook } from 'test-utils'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { confirmed4, confirmed5 } from '../../../../tests/unit/data/transactionDetailData'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { saveOffer } from '../../../utils/offer'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useTransactionHistorySetup } from './useTransactionHistorySetup'

describe('useTransactionHistorySetup', () => {
  const offerWithContract = { ...buyOffer, contractId: contractSummary.id }

  beforeAll(() => {
    useWalletState.getState().updateTxOfferMap(confirmed4.txid, [offerWithContract.id])
    useWalletState.getState().updateTxOfferMap(confirmed5.txid, [offerWithContract.id])
    saveOffer(offerWithContract)
    useTradeSummaryStore.getState().setContract(contractSummary.id, contractSummary)
  })
  it('should return transactions, refresh and isRefreshing', () => {
    const { result } = renderHook(useTransactionHistorySetup)
    expect(result.current.transactions).toEqual([])
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBe(false)
  })
  it('should return the stored transactions sorted by date and mapped to TxSummary type', () => {
    useWalletState.setState({ transactions: [confirmed4, confirmed5] })
    const { result } = renderHook(useTransactionHistorySetup)
    expect(result.current.transactions).toEqual([
      {
        id: 'txid4',
        type: 'TRADE',
        amount: 25000,
        confirmed: true,
        date: new Date('2009-02-13T23:31:30.000Z'),
        height: confirmed4.confirmationTime?.height,
        offerData: [
          {
            address: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
            amount: 21000,
            contractId: '123-456',
            currency: 'EUR',
            offerId: '37',
            price: 21,
          },
        ],
      },
      {
        id: 'txid5',
        type: 'TRADE',
        amount: 25000,
        confirmed: true,
        date: new Date('2009-02-13T23:31:30.000Z'),
        height: confirmed4.confirmationTime?.height,
        offerData: [
          {
            address: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
            amount: 21000,
            contractId: '123-456',
            currency: 'EUR',
            offerId: '37',
            price: 21,
          },
        ],
      },
    ])
  })
})
