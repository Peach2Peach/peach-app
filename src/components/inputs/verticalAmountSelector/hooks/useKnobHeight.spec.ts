import { useKnobHeight } from './useKnobHeight'
import { renderHook } from '@testing-library/react-native'

const mockDimensions = (width: number, height: number) => {
  jest.resetModules()
  jest.doMock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: () => ({ width, height }),
  }))
}

describe('useKnobHeight', () => {
  it('should return 32 if the device is wider than 375px and taller than 690px', () => {
    mockDimensions(376, 691)
    const { result } = renderHook(useKnobHeight)
    expect(result.current).toBe(32)
  })

  it('should return 22 if the device is not wider than 375px or not taller than 690px', () => {
    mockDimensions(375, 690)
    const { result, rerender } = renderHook(useKnobHeight)
    expect(result.current).toBe(22)
    mockDimensions(375, 691)
    rerender(undefined)
    expect(result.current).toBe(22)
    mockDimensions(376, 690)
    rerender(undefined)
    expect(result.current).toBe(22)
  })
})
