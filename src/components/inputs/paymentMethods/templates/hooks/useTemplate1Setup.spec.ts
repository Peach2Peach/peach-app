import { useTemplate1Setup } from './useTemplate1Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate1Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate1Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'sepa',
          beneficiary: 'beneficiary',
          iban: 'iban',
          bic: 'bic',
          reference: 'reference',
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
