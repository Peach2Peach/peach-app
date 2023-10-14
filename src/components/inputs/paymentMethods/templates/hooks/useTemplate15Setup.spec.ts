import { renderHook } from 'test-utils'
import { useTemplate15Setup } from './useTemplate15Setup'

describe('useTemplate15Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate15Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'cvu',
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
