import { renderHook } from '@testing-library/react-native'
import { useTemplate19Setup } from './useTemplate19Setup'

describe('useTemplate19Setup', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() =>
      useTemplate19Setup({
        data: {
          id: 'id',
          label: 'label',
          type: 'eversend',
          eversendUserName: 'eversendUserName',
          currencies: [],
        },
        currencies: [],
        onSubmit: jest.fn(),
        setStepValid: jest.fn(),
        paymentMethod: 'eversend',
        setFormData: jest.fn(),
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
