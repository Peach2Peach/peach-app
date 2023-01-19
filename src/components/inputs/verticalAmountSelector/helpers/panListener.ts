import { Dispatch, SetStateAction } from 'react'
import { Animated } from 'react-native'
import { interpolate, round } from '../../../../utils/math'

export const panListener = (
  pan: Animated.Value,
  range: [number, number],
  trackRange: [number, number],
  setValue: Dispatch<SetStateAction<number>>,
  restrictRange = trackRange,
  // eslint-disable-next-line max-params
) => {
  pan.extractOffset()
  pan.addListener((props) => {
    let v = props.value
    if (v < restrictRange[0]) {
      v = restrictRange[0]
    } else if (v > restrictRange[1]) {
      v = restrictRange[1]
    }
    if (v !== props.value) pan.setOffset(v)

    const val = interpolate(v, trackRange, range)
    setValue(round(val, -4))
  })

  return () => pan.removeAllListeners()
}
