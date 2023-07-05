import { renderHook } from '@testing-library/react-native'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { pending1, pendingTransactionSummary } from '../../../../tests/unit/data/transactionDetailData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useTransactionDetailsSetup } from './useTransactionDetailsSetup'

const useRouteMock = jest.fn(() => ({
  params: { txId: pendingTransactionSummary.id },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const wrapper = NavigationWrapper

jest.useFakeTimers({ now: pendingTransactionSummary.date })
describe('useTransactionDetailsSetup', () => {
  const pendingTx = { ...pending1, sent: 0, received: 900 }
  beforeAll(() => {
    useWalletState.getState().setTransactions([pendingTx])
    // @ts-ignore
    useWalletState.getState().updateTxOfferMap(pendingTx.txid, pendingTransactionSummary.offerId)
    useTradeSummaryStore
      .getState()
      // @ts-ignore
      .setOffer(pendingTransactionSummary.offerId, { ...buyOffer, id: pendingTransactionSummary.offerId })
  })
  it('should return defaults', () => {
    const { result } = renderHook(useTransactionDetailsSetup, { wrapper })
    expect(result.current).toEqual({
      transaction: pendingTransactionSummary,
      refresh: expect.any(Function),
      isRefreshing: false,
    })
  })
  it('should handle case where transaction is in store', () => {
    useWalletState.getState().setTransactions([])
    const { result } = renderHook(useTransactionDetailsSetup, { wrapper })
    expect(result.current.transaction).toBeUndefined()
  })
})
