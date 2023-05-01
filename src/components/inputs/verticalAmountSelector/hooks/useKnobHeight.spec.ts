import { mockDimensions } from '../../../../../tests/unit/helpers/mockDimensions'
import { useKnobHeight } from './useKnobHeight'
import { renderHook } from '@testing-library/react-native'

describe('useKnobHeight', () => {
  it('should return 32 if the device is wider than 375px and taller than 690px', () => {
    mockDimensions({ width: 376, height: 691 })
    const { result } = renderHook(useKnobHeight)
    expect(result.current).toBe(32)
  })

  it('should return 22 if the device is not wider than 375px or not taller than 690px', () => {
    mockDimensions({ width: 375, height: 690 })
    const { result, rerender } = renderHook(useKnobHeight)
    expect(result.current).toBe(22)
    mockDimensions({ width: 375, height: 691 })
    rerender(undefined)
    expect(result.current).toBe(22)
    mockDimensions({ width: 376, height: 690 })
    rerender(undefined)
    expect(result.current).toBe(22)
  })
})
