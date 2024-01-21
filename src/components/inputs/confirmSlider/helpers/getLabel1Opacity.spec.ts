import { Animated } from 'react-native'
import { getLabel1Opacity } from './getLabel1Opacity'

describe('getLabel1Opacity', () => {
  it('ensures interpolated value is within range', () => {
    const panValue = 0.2
    const pan = new Animated.Value(panValue)
    const opacity = 0.8
    pan.interpolate = jest.fn().mockReturnValue(opacity)

    expect(getLabel1Opacity(pan)).toBe(opacity)
    expect(pan.interpolate).toHaveBeenCalledWith({
      inputRange: [0, 1],
      outputRange: [1, 0],
    })
  })
})
