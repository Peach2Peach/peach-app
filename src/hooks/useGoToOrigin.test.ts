import { act, renderHook } from '@testing-library/react-hooks'
import { useGoToOrigin } from './useGoToOrigin'
import { useNavigation } from './useNavigation'

jest.mock('./useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    getState: jest.fn().mockReturnValue({
      routes: [{ name: 'buy' }, { name: 'buyPreferences' }, { name: 'paymentDetails' }],
    }),
    goBack: jest.fn(),
  }),
}))

describe('useGoToOrigin', () => {
  afterEach(() => {
    ;(<jest.Mock>useNavigation().goBack).mockReset()
  })
  it('goes back to origin and stops when found', () => {
    const { result } = renderHook(() => useGoToOrigin())
    act(() => {
      result.current('buy')
    })

    expect(useNavigation().goBack).toHaveBeenCalledTimes(2)
  })

  it('goes back to second origin and stops when found', () => {
    const { result } = renderHook(() => useGoToOrigin())
    act(() => {
      result.current('buyPreferences')
    })

    expect(useNavigation().goBack).toHaveBeenCalledTimes(1)
  })

  it('does nothing if origin not found', () => {
    const { result } = renderHook(() => useGoToOrigin())
    act(() => {
      result.current('settings')
    })

    expect(useNavigation().goBack).not.toHaveBeenCalled()
  })
})
