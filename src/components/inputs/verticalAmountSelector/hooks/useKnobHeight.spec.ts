import { renderHook } from 'test-utils'
import { useKnobHeight } from './useKnobHeight'

describe('useKnobHeight', () => {
  it('should return 30', () => {
    const { result } = renderHook(useKnobHeight)
    expect(result.current).toBe(30)
  })
})
