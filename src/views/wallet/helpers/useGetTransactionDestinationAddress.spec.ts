import { renderHook } from 'test-utils'
import {
  bitcoinJSTransactionWithRBF1,
  bitcoinJSTransactionWithRBF2,
} from '../../../../tests/unit/data/transactionDetailData'
import { useGetTransactionDestinationAddress } from './useGetTransactionDestinationAddress'

const useAreMyAddressesMock = jest.fn().mockReturnValue([true, false])
jest.mock('../../../hooks/wallet/useIsMyAddress', () => ({
  useAreMyAddresses: (...args: string[]) => useAreMyAddressesMock(...args),
}))

describe('useGetTransactionDestinationAddress', () => {
  const { outs } = bitcoinJSTransactionWithRBF2
  it('returns the address if there is only one output', () => {
    useAreMyAddressesMock.mockReturnValueOnce([true])
    const { result } = renderHook(useGetTransactionDestinationAddress, {
      initialProps: { outs: bitcoinJSTransactionWithRBF1.outs, incoming: false },
    })
    expect(result.current).toEqual('bcrt1q7qquf8rwx2wkmmp23y3vu3qqp3rwpq7cdznq7v')
  })
  it('returns the correct address an incoming transaction', () => {
    const { result } = renderHook(useGetTransactionDestinationAddress, { initialProps: { outs, incoming: true } })
    expect(result.current).toEqual('bcrt1qtevf8qxjr2f3ku982l324rstmknffvwayk6wp3')
  })
  it('returns the correct address an outgoing transaction', () => {
    const { result } = renderHook(useGetTransactionDestinationAddress, { initialProps: { outs, incoming: false } })
    expect(result.current).toEqual('mqb8gXeF3tHTmKs1EB5fh29J9Vii4pGDkj')
  })
})
