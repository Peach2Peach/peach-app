import { renderHook } from '@testing-library/react-native'
import { useTemplate16Setup } from './useTemplate16Setup'

describe('useTemplate16Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate16Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'alias',
          beneficiary: 'beneficiary',
          cvuAlias: 'cvuAlias',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'alias',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
