import { act, renderHook } from 'test-utils'
import { usePhoneInput } from './usePhoneInput'

describe('usePhoneInput', () => {
  const mockData: Partial<PaymentData> = {}
  it('should return the correct defaults', () => {
    const { result } = renderHook(usePhoneInput, { initialProps: mockData })

    expect(result.current).toStrictEqual({
      phoneInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      phone: '',
      phoneIsValid: false,
      setDisplayErrors: expect.any(Function),
    })
  })

  it('should update the phone', () => {
    const { result } = renderHook(usePhoneInput, { initialProps: mockData })

    act(() => {
      result.current.phoneInputProps.onChange('+4912341234')
    })

    expect(result.current).toStrictEqual({
      phoneInputProps: {
        value: '+4912341234',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      phone: '+4912341234',
      phoneIsValid: true,
      setDisplayErrors: expect.any(Function),
    })
  })

  it('should show the display errors', () => {
    const { result } = renderHook(usePhoneInput, { initialProps: mockData })

    act(() => {
      result.current.setDisplayErrors(true)
    })

    expect(result.current).toStrictEqual({
      phoneInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: [
          'this field is required',
          'please enter a valid value',
          'numbers from this country are not allowed',
        ],
      },
      phone: '',
      phoneIsValid: false,
      setDisplayErrors: expect.any(Function),
    })
  })
})
