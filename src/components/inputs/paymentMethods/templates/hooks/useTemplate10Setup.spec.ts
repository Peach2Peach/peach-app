import { renderHook } from 'test-utils'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useTemplate10Setup } from './useTemplate10Setup'

describe('useTemplate10Setup', () => {
  const mockProps: FormProps = {
    data: {
      type: 'liquid',
      currencies: ['USDT'],
    },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }
  it('should return the correct defaults', () => {
    const { result } = renderHook(useTemplate10Setup, { initialProps: mockProps })

    expect(result.current).toEqual({
      labelInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: ['this field is required'],
      },
      receiveAddressInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: ['this field is required'],
        onSubmit: expect.any(Function),
      },
    })
  })
})
