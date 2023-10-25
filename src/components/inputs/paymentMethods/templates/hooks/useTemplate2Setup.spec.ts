import { renderHook } from 'test-utils'
import { useTemplate2Setup } from './useTemplate2Setup'

describe('useTemplate2Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate2Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'advcash',
          wallet: 'wallet',
          email: 'email',
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
