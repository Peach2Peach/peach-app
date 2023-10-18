import Clipboard from '@react-native-clipboard/clipboard'
import { Linking } from 'react-native'
import { act, renderHook } from 'test-utils'
import { useBitcoinAddressSetup } from './useBitcoinAddressSetup'

jest.useFakeTimers()
// eslint-disable-next-line max-lines-per-function
describe('useBitcoinAddressSetup', () => {
  const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'

  it('should return the correct default values', () => {
    const { result } = renderHook((props) => useBitcoinAddressSetup(props), {
      initialProps: {
        address,
      },
    })
    expect(result.current).toEqual({
      openInWalletOrCopyPaymentRequest: expect.any(Function),
      copyPaymentRequest: expect.any(Function),
      copyAddress: expect.any(Function),
      showAddressCopied: false,
      showPaymentRequestCopied: false,
      addressParts: {
        one: '1A1z',
        two: 'P1eP5',
        three: 'QGefi2DMPTfTL5SLmv7D',
        four: 'ivfNa',
      },
      urn: new URL(`bitcoin:${address}`),
    })
  })
  it('should add the amount to the URN if provided', () => {
    const { result } = renderHook((props) => useBitcoinAddressSetup(props), {
      initialProps: {
        address,
        amount: 100,
      },
    })
    expect(result.current.urn.href).toEqual(`bitcoin:${address}?amount=100`)
  })
  it('should add the label to the URN if provided', () => {
    const { result } = renderHook((props) => useBitcoinAddressSetup(props), {
      initialProps: {
        address,
        label: 'test',
      },
    })
    expect(result.current.urn.href).toEqual(`bitcoin:${address}?message=test`)
  })
  it('should copy the address to the clipboard', () => {
    const { result } = renderHook(useBitcoinAddressSetup, {
      initialProps: {
        address,
      },
    })

    act(() => {
      result.current.copyAddress()
    })
    expect(result.current.showAddressCopied).toBe(true)
    expect(Clipboard.getString()).toEqual(address)
    act(() => {
      jest.runAllTimers()
    })
    expect(result.current.showAddressCopied).toBe(false)
  })
  it('should copy the payment request to the clipboard', () => {
    const { result } = renderHook(useBitcoinAddressSetup, {
      initialProps: {
        address,
      },
    })

    act(() => {
      result.current.copyPaymentRequest()
    })
    expect(result.current.showPaymentRequestCopied).toBe(true)
    expect(Clipboard.getString()).toEqual(result.current.urn.href)
    act(() => {
      jest.runAllTimers()
    })
    expect(result.current.showPaymentRequestCopied).toBe(false)
  })
  it('should open the address in the wallet if available', async () => {
    const { result } = renderHook(useBitcoinAddressSetup, {
      initialProps: {
        address,
      },
    })

    const openURL = jest.spyOn(Linking, 'openURL')
    await act(async () => {
      await result.current.openInWalletOrCopyPaymentRequest()
    })
    expect(openURL).toHaveBeenCalledWith(result.current.urn.href)
    expect(() => Linking.openURL(result.current.urn.href)).not.toThrow()
    expect(result.current.showPaymentRequestCopied).toBe(false)
  })
  it('should copy the payment request to the clipboard if the wallet is not available', async () => {
    Clipboard.setString('')
    const openURL = jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('test'))

    const { result } = renderHook(useBitcoinAddressSetup, {
      initialProps: {
        address,
      },
    })

    await act(async () => {
      await result.current.openInWalletOrCopyPaymentRequest()
    })
    expect(openURL).toHaveBeenCalledWith(result.current.urn.href)
    expect(Clipboard.getString()).toEqual(result.current.urn.href)
    expect(result.current.showPaymentRequestCopied).toBe(true)

    act(() => {
      jest.runAllTimers()
    })
    expect(result.current.showPaymentRequestCopied).toBe(false)
  })
})
