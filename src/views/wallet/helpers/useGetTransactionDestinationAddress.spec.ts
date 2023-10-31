import { renderHook } from 'test-utils'
import { useGetTransactionDestinationAddress } from './useGetTransactionDestinationAddress'

const useAreMyAddressesMock = jest.fn().mockReturnValue([true, false])
jest.mock('../../../hooks/wallet/useIsMyAddress', () => ({
  useAreMyAddresses: (...args: string[]) => useAreMyAddressesMock(...args),
}))
describe('useGetTransactionDestinationAddress', () => {
  const myAddress = 'bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt'
  const notMyAddress = '1B5BPUZGErrCzDPPWc7Hs6vyHW81CmVpdN'
  const vout = [{ scriptpubkey_address: myAddress }, { scriptpubkey_address: notMyAddress }] as Transaction['vout']
  it('returns the correct address an incoming transaction', () => {
    const { result } = renderHook(useGetTransactionDestinationAddress, { initialProps: { vout, incoming: true } })
    expect(result.current).toEqual(myAddress)
  })
  it('returns the correct address an outgoing transaction', () => {
    const { result } = renderHook(useGetTransactionDestinationAddress, { initialProps: { vout, incoming: false } })
    expect(result.current).toEqual(notMyAddress)
  })
})
