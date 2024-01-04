/* eslint-disable no-magic-numbers */
import { Animated } from 'react-native'
import { getTranslateX } from './getTranslateX'

describe('getTranslateX', () => {
  it('ensures interpolated value is within range', () => {
    const pan = new Animated.Value(50)
    const range: [number, number] = [-100, 100]

    const result = getTranslateX(pan, range)

    expect(result).toEqual({
      transform: [
        {
          translateX: expect.objectContaining({
            _interpolation: expect.any(Function),
          }),
        },
      ],
    })
  })
})
