import { renderHook } from 'test-utils'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useTemplate11Setup } from './useTemplate11Setup'

describe('useTemplate11Setup', () => {
  const mockProps: FormProps = {
    data: { type: 'lnurl', currencies: ['SAT'] },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }
  it('should return the correct defaults', () => {
    const { result } = renderHook(useTemplate11Setup, { initialProps: mockProps })

    expect(result.current).toEqual({
      labelInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: ['this field is required'],
      },
      lnurlAddressInputProps: {
        value: '',
        label: 'LNURL address',
        placeholder: 'satoshi@lightning.gmx.com',
        onChange: expect.any(Function),
        errorMessage: ['this field is required', 'email is not valid'],
        onSubmit: expect.any(Function),
      },
    })
  })
})
