import { renderHook } from 'test-utils'
import { useTemplate17Setup } from './useTemplate17Setup'

describe('useTemplate17Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate17Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'bancolombia',
          beneficiary: 'beneficiary',
          accountNumber: 'accountNumber',
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
