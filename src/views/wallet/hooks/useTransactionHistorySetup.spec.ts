import { renderHook } from '@testing-library/react-native'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { offerSummary } from '../../../../tests/unit/data/offerSummaryData'
import { confirmed4, confirmed5 } from '../../../../tests/unit/data/transactionDetailData'
import { NavigationWrapper, headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useTransactionHistorySetup } from './useTransactionHistorySetup'

describe('useTransactionHistorySetup', () => {
  const offerWithContract = { ...offerSummary, contractId: contractSummary.id }

  beforeAll(() => {
    useWalletState.getState().updateTxOfferMap(confirmed4.txid, offerWithContract.id)
    useWalletState.getState().updateTxOfferMap(confirmed5.txid, offerWithContract.id)
    useTradeSummaryStore.getState().setOffer(offerWithContract.id, offerWithContract)
    useTradeSummaryStore.getState().setContract(contractSummary.id, contractSummary)
  })
  it('should return transactions, refresh and isRefreshing', () => {
    const { result } = renderHook(useTransactionHistorySetup, { wrapper: NavigationWrapper })
    expect(result.current.transactions).toEqual([])
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBe(false)
  })
  it('should set up the header correctly', () => {
    renderHook(useTransactionHistorySetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should return the stored transactions sorted by date and mapped to TxSummary type', () => {
    useWalletState.setState({ transactions: [confirmed4, confirmed5] })
    const { result } = renderHook(useTransactionHistorySetup, { wrapper: NavigationWrapper })
    expect(result.current.transactions).toEqual([
      {
        id: 'txid4',
        type: 'TRADE',
        offerId: offerSummary.id,
        contractId: contractSummary.id,
        amount: 25000,
        currency: 'EUR',
        price: 21,
        confirmed: true,
        date: new Date('2009-02-13T23:31:30.000Z'),
        height: confirmed4.confirmationTime?.height,
      },
      {
        id: 'txid5',
        type: 'TRADE',
        amount: 25000,
        offerId: offerSummary.id,
        contractId: contractSummary.id,
        price: 21,
        currency: 'EUR',
        confirmed: true,
        date: new Date('2009-02-13T23:31:30.000Z'),
        height: confirmed4.confirmationTime?.height,
      },
    ])
  })
})
