import { useTemplate7Setup } from './useTemplate7Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate7Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate7Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'straksbetaling',
          beneficiary: 'beneficiary',
          accountNumber: 'accountNumber',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'straksbetaling',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
