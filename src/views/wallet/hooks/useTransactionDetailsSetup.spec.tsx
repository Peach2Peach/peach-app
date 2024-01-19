import { act, renderHook } from 'test-utils'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import {
  pending1,
  pendingTransactionSummary,
  transactionWithRBF1,
} from '../../../../tests/unit/data/transactionDetailData'
import { setRouteMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { MSINASECOND } from '../../../constants'
import { saveOffer } from '../../../utils/offer/saveOffer'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useTransactionDetailsSetup } from './useTransactionDetailsSetup'

const useTransactionDetailsMock = jest.fn().mockReturnValue({ transaction: null })
jest.mock('../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: (...args: unknown[]) => useTransactionDetailsMock(...args),
}))

jest.useFakeTimers({ now: pendingTransactionSummary.date })

const minAmount = 900
const maxAmount = 900
describe('useTransactionDetailsSetup', () => {
  const pendingTx = { ...pending1, txid: transactionWithRBF1.txid, sent: 0, received: 900 }

  beforeAll(() => {
    useWalletState.getState().updateTxOfferMap(transactionWithRBF1.txid, ['123'])
    saveOffer({ ...buyOffer, amount: [minAmount, maxAmount], id: '123' })
    setRouteMock({ name: 'transactionDetails', key: 'transactionDetails', params: { txId: transactionWithRBF1.txid } })
  })
  beforeEach(() => {
    useWalletState.getState().setTransactions([])
  })

  it('should return defaults', () => {
    const { result } = renderHook(useTransactionDetailsSetup)
    expect(result.current).toEqual({
      transaction: undefined,
    })
  })
  it('should return local transaction', () => {
    useWalletState.getState().setTransactions([pendingTx])

    const { result } = renderHook(useTransactionDetailsSetup)
    expect(result.current.transaction).toEqual({
      ...pendingTransactionSummary,
      id: pendingTx.txid,
    })
  })
  it('should return transaction when loaded', () => {
    const transactionSummary = {
      amount: 0,
      confirmed: true,
      date: new Date(transactionWithRBF1.status.block_time * MSINASECOND),
      height: transactionWithRBF1.status.block_height,
      id: transactionWithRBF1.txid,
      offerData: [
        {
          address: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
          amount: 900,
          contractId: undefined,
          currency: undefined,
          offerId: '123',
          price: undefined,
        },
      ],
      type: 'DEPOSIT',
    }
    useTransactionDetailsMock.mockReturnValueOnce({ transaction: transactionWithRBF1 })
    const { result } = renderHook(useTransactionDetailsSetup)
    expect(result.current.transaction).toEqual(transactionSummary)
  })
  it('should reload when transaction in store update', () => {
    useWalletState.getState().setTransactions([])
    const { result } = renderHook(useTransactionDetailsSetup)
    expect(result.current.transaction).toBeUndefined()

    act(() => useWalletState.getState().setTransactions([pendingTx]))

    expect(result.current.transaction).toEqual({
      ...pendingTransactionSummary,
      id: pendingTx.txid,
    })
  })
})
