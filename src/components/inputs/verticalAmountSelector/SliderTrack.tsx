import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { innerShadow } from '../../../utils/layout'
import { Shadow } from '../../ui'

export const SliderTrack = ({ children, onLayout }: ComponentProps) => (
  <View style={tw`w-6 h-full rounded-full bg-primary-background-dark`}>
    <Shadow shadow={innerShadow} style={tw`absolute w-full h-full overflow-hidden rounded-full`}></Shadow>
    <View style={tw`h-full m-0.5`} {...{ onLayout }}>
      {children}
    </View>
  </View>
)
