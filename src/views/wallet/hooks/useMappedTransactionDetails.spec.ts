import { renderHook, waitFor } from 'test-utils'
import { bdkTransactionWithRBF1, bitcoinJSTransactionWithRBF1 } from '../../../../tests/unit/data/transactionDetailData'
import { useMappedTransactionDetails } from './useMappedTransactionDetails'

describe('useMappedTransactionDetails', () => {
  const initialProps = {
    localTx: bdkTransactionWithRBF1,
  }
  it('returns mapped transaction', async () => {
    const { result } = renderHook(useMappedTransactionDetails, { initialProps })
    await waitFor(() => expect(result.current).toEqual(bitcoinJSTransactionWithRBF1))
  })
  it('returns undefined if transaction is undefined', async () => {
    const { result } = renderHook(useMappedTransactionDetails, { initialProps: { localTx: undefined } })
    await waitFor(() => expect(result.current).toEqual(undefined))
  })
})
