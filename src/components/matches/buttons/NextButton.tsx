import React from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'

type SliderArrowProps = {
  onPress: (event: GestureResponderEvent) => void
}

export const NextButton = (props: SliderArrowProps) => (
  <Pressable {...props} style={tw`absolute right-2 z-10`}>
    <Icon id="sliderNext" style={tw`w-4 h-4`} />
  </Pressable>
)
