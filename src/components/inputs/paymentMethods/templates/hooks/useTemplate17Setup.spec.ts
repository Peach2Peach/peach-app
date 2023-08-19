import { renderHook } from '@testing-library/react-native'
import { useTemplate17Setup } from './useTemplate17Setup'

describe('useTemplate17Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate17Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'bancolombia',
          beneficiary: 'beneficiary',
          accountNumber: 'accountNumber',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'bancolombia',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
