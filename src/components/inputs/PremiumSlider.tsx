import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { mildShadow } from '../../utils/layout'
import { Shadow, Text } from '..'
import { debounce } from '../../utils/performance'
import i18n from '../../utils/i18n'

type PremiumSliderProps = ComponentProps & {
  value: number
  min: number
  max: number
  onChange?: (value: number) => void
  displayUpdate?: (value: number) => void
}

const onStartShouldSetResponder = () => true

/**
 * @description Component to display premium slider
 * @param props Component properties
 * @param props.value current value
 * @param props.min minimum value
 * @param props.max maximum value
 * @param props.value current value
 * @param [props.onChange] on change handler
 * @example
 */

export const PremiumSlider = ({ value, min, max, onChange, displayUpdate, style }: PremiumSliderProps): ReactElement => {
  const [delta] = useState(max - min)
  const [markerX] = useState((value - min) / delta)
  const [premium, setPremium] = useState(value)
  let trackWidth = useRef(260).current

  const pan = useRef(new Animated.Value(markerX * trackWidth)).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: pan }], { useNativeDriver: false })(e, gestureState)
      },
      onPanResponderRelease: () => pan.extractOffset(),
      onShouldBlockNativeResponder: () => true,
    }),
  ).current

  useEffect(() => {
    pan.extractOffset()
    pan.addListener((props) => {
      if (props.value < 0) pan.setOffset(0)
      if (props.value > trackWidth) pan.setOffset(trackWidth)

      const boundedX = props.value < 0 ? 0 : Math.min(props.value, trackWidth)
      const val = Math.round(((boundedX / trackWidth) * delta + min) * 2) / 2
      setPremium(val)
    })

    return () => pan.removeAllListeners()
  }, [])

  const debounced = useRef(
    debounce((deps: { premium: number }) => {
      if (onChange) onChange(deps.premium)
    }, 300),
  )

  const deps: AnyObject = { premium }
  useEffect(
    () => debounced.current(deps),
    Object.keys(deps).map((dep) => deps[dep]),
  )

  useEffect(() => {
    if (displayUpdate) displayUpdate(premium)
  }, [premium])

  const onLayout = (event: LayoutChangeEvent) => (trackWidth = event.nativeEvent.layout.width)

  return (
    <View {...panResponder.panHandlers} style={style}>
      <Shadow shadow={mildShadow} style={tw`w-full`}>
        <View style={tw`p-5 pt-3 bg-white-1 border border-grey-4 rounded`}>
          <View style={tw`w-full flex-row justify-between`}>
            <Text style={tw`font-baloo text-xs text-red`}>{min}%</Text>
            <Text style={tw`font-baloo text-xs text-grey-2`}>{i18n('form.premium.marketPrice')}</Text>
            <Text style={tw`font-baloo text-xs text-green`}>+{max}%</Text>
          </View>
          <View onLayout={onLayout} style={tw`h-0 mx-3 flex-row items-center mt-2 border-2 border-grey-4 rounded`}>
            <Animated.View
              onStartShouldSetResponder={onStartShouldSetResponder}
              style={[
                tw`z-10 w-10 flex items-center`,
                {
                  transform: [
                    {
                      translateX: pan.interpolate({
                        inputRange: [0, trackWidth],
                        outputRange: [-tw`w-10`.width / 2, trackWidth - (tw`w-6`.width as number) / 2],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            >
              <Icon id="triangleUp" style={tw`w-6 h-6`} />
            </Animated.View>
          </View>
        </View>
      </Shadow>
    </View>
  )
}

export default PremiumSlider
