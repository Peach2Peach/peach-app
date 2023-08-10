import { renderHook } from '@testing-library/react-native'
import { useTemplate16Setup } from './useTemplate16Setup'

describe('useTemplate17Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate16Setup({
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
