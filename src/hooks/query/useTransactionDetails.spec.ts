import { renderHook, waitFor } from 'test-utils'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useTransactionDetails } from './useTransactionDetails'

jest.useFakeTimers()

const getTransactionDetailsMock = jest.fn().mockResolvedValue([bitcoinTransaction])
jest.mock('../../utils/electrum/getTransactionDetails', () => ({
  getTransactionDetails: () => getTransactionDetailsMock(),
}))

describe('useTransactionDetails', () => {
  const initialProps = { txId: 'txId' }
  const transaction = bitcoinTransaction

  afterEach(() => {
    queryClient.clear()
  })

  it('fetches transaction details from API', async () => {
    const { result } = renderHook(useTransactionDetails, { initialProps })
    expect(result.current).toEqual({
      transaction: undefined,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({
      transaction,
      isLoading: false,
      error: null,
    })
  })
  it('returns error if server did not return result', async () => {
    getTransactionDetailsMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useTransactionDetails, { initialProps })
    expect(result.current).toEqual({
      transaction: undefined,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      transaction: undefined,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    })
  })
})
