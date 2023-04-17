import { useTemplate5Setup } from './useTemplate5Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate5Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate5Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'fasterPayments',
          beneficiary: 'beneficiary',
          ukBankAccount: 'ukBankAccount',
          ukSortCode: 'ukSortCode',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'fasterPayments',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
