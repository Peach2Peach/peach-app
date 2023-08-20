import { renderHook } from '@testing-library/react-native'
import { useTemplate9Setup } from './useTemplate9Setup'

describe('useTemplate9Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate9Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'nationalTransferBG',
          accountNumber: 'accountNumber',
          reference: 'reference',
          iban: 'iban',
          bic: 'bic',
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
