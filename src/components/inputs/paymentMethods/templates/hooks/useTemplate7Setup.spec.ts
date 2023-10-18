import { renderHook } from 'test-utils'
import { useTemplate7Setup } from './useTemplate7Setup'

describe('useTemplate7Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate7Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'straksbetaling',
          beneficiary: 'beneficiary',
          accountNumber: 'accountNumber',
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
