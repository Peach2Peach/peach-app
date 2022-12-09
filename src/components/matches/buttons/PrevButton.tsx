import React from 'react'
import { GestureResponderEvent, Pressable } from 'react-native'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'

type SliderArrowProps = {
  onPress: (event: GestureResponderEvent) => void
}

export const PrevButton = (props: SliderArrowProps) => (
  <Pressable {...props} style={tw`absolute left-2 z-10`}>
    <Icon id="sliderPrev" style={tw`w-4 h-4`} />
  </Pressable>
)
