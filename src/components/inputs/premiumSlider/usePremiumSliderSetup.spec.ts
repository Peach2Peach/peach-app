import { renderHook } from '@testing-library/react-native'
import { usePremiumSliderSetup } from './usePremiumSliderSetup'
import { act } from 'react-test-renderer'
import { LayoutChangeEvent } from 'react-native'

describe('usePremiumSliderSetup', () => {
  const labelPosition = [-130, -62, 0, 62, 130]
  it('should default values', () => {
    const { result } = renderHook(usePremiumSliderSetup)
    expect(result.current).toEqual({
      knobWidth: 32,
      trackWidth: 260,
      labelPosition,
      max: 21,
      min: -21,
      onLayout: expect.any(Function),
      panResponder: expect.any(Object),
      pan: expect.any(Object),
    })
  })
  it('should update onTrackLayout', () => {
    const { result } = renderHook(usePremiumSliderSetup)
    act(() => result.current.onLayout({ nativeEvent: { layout: { width: 400 } } } as LayoutChangeEvent))
    expect(result.current.trackWidth).toEqual(368)
  })
  it('should ignore layout events with no dimensions', () => {
    const { result } = renderHook(usePremiumSliderSetup)
    act(() => result.current.onLayout({ nativeEvent: { layout: { width: NaN } } } as LayoutChangeEvent))
    expect(result.current.trackWidth).toEqual(260)
  })
})
