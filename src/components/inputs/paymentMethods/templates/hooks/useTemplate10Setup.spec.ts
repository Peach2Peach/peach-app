import { useTemplate10Setup } from './useTemplate10Setup'
import { renderHook } from '@testing-library/react-native'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'

describe('useTemplate10Setup', () => {
  const mockProps: FormProps = {
    data: {},
    currencies: [],
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    paymentMethod: 'liquid',
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
