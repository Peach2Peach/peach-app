import { renderHook } from 'test-utils'
import { useTemplate16Setup } from './useTemplate16Setup'

describe('useTemplate16Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate16Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'alias',
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
