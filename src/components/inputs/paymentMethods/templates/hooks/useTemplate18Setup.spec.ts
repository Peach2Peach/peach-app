import { renderHook } from '@testing-library/react-native'
import { useTemplate18Setup } from './useTemplate18Setup'

describe('useTemplate18Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate18Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'chippercash',
          chipperTag: '@chipperTag',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'chippercash',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
