/* eslint-disable no-magic-numbers */
import { Animated } from 'react-native'
import { getTranslateY } from './getTranslateY'

describe('getTranslateY', () => {
  it('ensures interpolated value is within range', () => {
    const pan = new Animated.Value(50)
    const range: [number, number] = [-100, 100]

    const result = getTranslateY(pan, range)

    expect(result).toEqual({
      transform: [
        {
          translateY: expect.objectContaining({
            _interpolation: expect.any(Function),
          }),
        },
      ],
    })
  })
})
