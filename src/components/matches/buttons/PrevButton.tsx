import React from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'

type SliderArrowProps = {
  onPress: (event: GestureResponderEvent) => void
}

export const PrevButton = (props: SliderArrowProps) => (
  <Pressable {...props} style={tw`absolute z-10 left-2`}>
    <Icon id="sliderPrev" style={tw`w-4 h-4`} />
  </Pressable>
)
