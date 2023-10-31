import { renderHook } from 'test-utils'
import { useTemplate6Setup } from './useTemplate6Setup'

describe('useTemplate6Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate6Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'paypal',
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
