import { Animated } from 'react-native'
import { EIGHTY_PERCENT, getBackgroundColor } from './getBackgroundColor'

describe('getBackgroundColor', () => {
  it('ensures interpolated value is within range', () => {
    const pan = new Animated.Value(EIGHTY_PERCENT)
    const bg = '#F56522'
    pan.interpolate = jest.fn().mockReturnValue(bg)

    expect(getBackgroundColor(pan)).toBe(bg)
    expect(pan.interpolate).toHaveBeenCalledWith({
      inputRange: [0, EIGHTY_PERCENT, 1],
      outputRange: ['#F56522', '#F56522', '#65A519'],
    })
  })
})
