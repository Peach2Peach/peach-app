import { useTemplate2Setup } from './useTemplate2Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate2Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate2Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'advcash',
          wallet: 'wallet',
          email: 'email',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'advcash',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
