import { renderHook } from 'test-utils'
import { useTemplate1Setup } from './useTemplate1Setup'

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
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
