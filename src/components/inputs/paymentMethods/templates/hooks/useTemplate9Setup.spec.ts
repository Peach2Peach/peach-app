import { useTemplate9Setup } from './useTemplate9Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate9Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate9Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'nationalTransferBE',
          accountNumber: 'accountNumber',
          reference: 'reference',
          iban: 'iban',
          bic: 'bic',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'nationalTransferBE',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
