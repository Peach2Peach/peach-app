import { useKnobHeight } from './useKnobHeight'
import { renderHook } from '@testing-library/react-native'

describe('useKnobHeight', () => {
  it('should return 30', () => {
    const { result } = renderHook(useKnobHeight)
    expect(result.current).toBe(30)
  })
})
