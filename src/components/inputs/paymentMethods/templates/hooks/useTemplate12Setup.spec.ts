import { renderHook } from 'test-utils'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useTemplate12Setup } from './useTemplate12Setup'

describe('useTemplate12Setup', () => {
  const defaultData = {
    type: 'rappipay',
    id: 'id',
    label: '',
    phone: '',
    currencies: ['COP'],
  } satisfies FormProps['data']

  it('should return the correct defaults', () => {
    const { result } = renderHook(() =>
      useTemplate12Setup({ data: defaultData, setStepValid: jest.fn(), setFormData: jest.fn() }),
    )
    expect(result.current.labelInputProps).toStrictEqual({
      value: '',
      onChange: expect.any(Function),
      errorMessage: ['this field is required'],
    })
    expect(result.current.phoneInputProps).toStrictEqual({
      value: '',
      errorMessage: [
        'this field is required',
        'please enter a valid value',
        'numbers from this country are not allowed',
      ],
      onChange: expect.any(Function),
    })
    expect(result.current.currencySelectionProps).toStrictEqual({
      paymentMethod: 'rappipay',
      selectedCurrencies: ['COP'],
      onToggle: expect.any(Function),
    })
    expect(result.current.shouldShowCurrencySelection).toBe(false)
  })
})
