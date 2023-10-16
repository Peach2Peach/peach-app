import { act, renderHook } from 'test-utils'
import { useReceiveAddressInput } from './useReceiveAddressInput'

describe('useReceiveAddressInput', () => {
  const mockData: Partial<PaymentData> = {}
  it('should return the correct defaults', () => {
    const { result } = renderHook(useReceiveAddressInput, { initialProps: mockData })

    expect(result.current).toStrictEqual({
      receiveAddressInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      receiveAddress: '',
      setDisplayErrors: expect.any(Function),
      receiveAddressErrors: ['this field is required'],
    })
  })

  it('should update the receiveAddress', () => {
    const { result } = renderHook(useReceiveAddressInput, { initialProps: mockData })

    act(() => {
      result.current.receiveAddressInputProps.onChange('newReceiveAddress')
    })

    expect(result.current).toStrictEqual({
      receiveAddressInputProps: {
        value: 'newReceiveAddress',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      receiveAddress: 'newReceiveAddress',
      setDisplayErrors: expect.any(Function),
      receiveAddressErrors: [],
    })
  })

  it('should show the display errors', () => {
    const { result } = renderHook(useReceiveAddressInput, { initialProps: mockData })

    act(() => {
      result.current.setDisplayErrors(true)
    })

    expect(result.current).toStrictEqual({
      receiveAddressInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: ['this field is required'],
      },
      receiveAddress: '',
      setDisplayErrors: expect.any(Function),
      receiveAddressErrors: ['this field is required'],
    })
  })
})
