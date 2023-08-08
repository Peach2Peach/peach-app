import { renderHook } from '@testing-library/react-native'
import { useTemplate14Setup } from './useTemplate14Setup'

describe('useTemplate14Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate14Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'cbu',
          beneficiary: 'beneficiary',
          accountNumber: 'accountNumber',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'sepa',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
