import { useTemplate8Setup } from './useTemplate8Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate8Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate8Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'paysera',
          phone: 'phone',
          beneficiary: 'beneficiary',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'paysera',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
