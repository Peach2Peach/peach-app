import { useTemplate3Setup } from './useTemplate3Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate3Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate3Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'vipps',
          phone: 'phone',
          beneficiary: 'beneficiary',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'vipps',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
