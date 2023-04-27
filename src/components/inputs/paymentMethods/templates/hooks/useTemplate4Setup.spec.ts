import { useTemplate4Setup } from './useTemplate4Setup'
import { renderHook } from '@testing-library/react-native'

describe('useTemplate4Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate4Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'giftCard.amazon',
          email: 'email',
          beneficiary: 'beneficiary',
          reference: 'reference',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'giftCard.amazon',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
