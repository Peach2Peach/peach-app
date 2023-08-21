import { renderHook } from '@testing-library/react-native'
import { useTemplate21Setup } from './useTemplate21Setup'

describe('useTemplate21Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate21Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'gtBank',
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
