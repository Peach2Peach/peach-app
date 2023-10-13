import { Animated } from 'react-native'
import { getBackgroundColor } from './getBackgroundColor'

describe('getBackgroundColor', () => {
  it('ensures interpolated value is within range', () => {
    const pan = new Animated.Value(0.8)
    const bg = '#F56522'
    pan.interpolate = jest.fn().mockReturnValue(bg)

    expect(getBackgroundColor(pan)).toBe(bg)
    expect(pan.interpolate).toHaveBeenCalledWith({
      inputRange: [0, 0.8, 1],
      outputRange: ['#F56522', '#F56522', '#65A519'],
    })
  })
})
