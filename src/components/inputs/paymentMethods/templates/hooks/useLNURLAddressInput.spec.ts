import { act, renderHook } from 'test-utils'
import { useLNURLAddressInput } from './useLNURLAddressInput'

describe('useLNURLAddressInput', () => {
  const mockData: Partial<PaymentData> = {}
  it('should return the correct defaults', () => {
    const { result } = renderHook(useLNURLAddressInput, { initialProps: mockData })

    expect(result.current).toStrictEqual({
      lnurlAddressInputProps: {
        value: '',
        label: 'LNURL address',
        placeholder: 'satoshi@lightning.gmx.com',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      lnurlAddress: '',
      setDisplayErrors: expect.any(Function),
      lnurlAddressErrors: ['this field is required', 'email is not valid'],
    })
  })

  it('should update the lnurlAddress', () => {
    const { result } = renderHook(useLNURLAddressInput, { initialProps: mockData })

    act(() => {
      result.current.lnurlAddressInputProps.onChange('satoshi@lightning.gmx.com')
    })

    expect(result.current).toStrictEqual({
      lnurlAddressInputProps: {
        value: 'satoshi@lightning.gmx.com',
        label: 'LNURL address',
        placeholder: 'satoshi@lightning.gmx.com',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      lnurlAddress: 'satoshi@lightning.gmx.com',
      setDisplayErrors: expect.any(Function),
      lnurlAddressErrors: [],
    })
  })

  it('should show the display errors', () => {
    const { result } = renderHook(useLNURLAddressInput, { initialProps: mockData })

    act(() => {
      result.current.setDisplayErrors(true)
    })

    expect(result.current).toStrictEqual({
      lnurlAddressInputProps: {
        value: '',
        label: 'LNURL address',
        placeholder: 'satoshi@lightning.gmx.com',
        onChange: expect.any(Function),
        errorMessage: ['this field is required', 'email is not valid'],
      },
      lnurlAddress: '',
      setDisplayErrors: expect.any(Function),
      lnurlAddressErrors: ['this field is required', 'email is not valid'],
    })
  })
})
