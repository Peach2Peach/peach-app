import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'

export const KNOBHEIGHT = tw`h-8`.height as number

export const SliderKnob = ({ style }: ComponentProps) => (
  <View style={[{ height: KNOBHEIGHT }, tw`items-center justify-center w-5 rounded-full bg-primary-main`, style]}>
    <Icon id="chevronsLeft" style={tw`w-4 h-4`} color={tw`text-primary-background-light`.color} />
  </View>
)
