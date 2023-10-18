import { renderHook } from 'test-utils'
import { useTemplate8Setup } from './useTemplate8Setup'

describe('useTemplate8Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate8Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'paysera',
          phone: 'phone',
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
