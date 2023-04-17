import { useTemplate6Setup } from './useTemplate6Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate6Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate6Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'paypal',
          email: 'email',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'paypal',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
