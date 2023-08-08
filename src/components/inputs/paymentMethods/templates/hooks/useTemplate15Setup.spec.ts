import { renderHook } from '@testing-library/react-native'
import { useTemplate15Setup } from './useTemplate15Setup'

describe('useTemplate15Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate15Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'cvu',
          beneficiary: 'beneficiary',
          accountNumber: 'accountNumber',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'cvu',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
