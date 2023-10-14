import { renderHook } from 'test-utils'
import { useTemplate4Setup } from './useTemplate4Setup'

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
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
