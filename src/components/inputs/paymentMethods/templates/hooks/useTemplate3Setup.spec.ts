import { renderHook } from 'test-utils'
import { useTemplate3Setup } from './useTemplate3Setup'

describe('useTemplate3Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate3Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'vipps',
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
