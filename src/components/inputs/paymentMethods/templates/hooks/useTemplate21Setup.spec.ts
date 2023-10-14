import { renderHook } from 'test-utils'
import { useTemplate21Setup } from './useTemplate21Setup'

describe('useTemplate21Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate21Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'nationalTransferNG',
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
