import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { innerShadow } from '../../../utils/layout'
import { Shadow } from '../../ui'

export const SliderTrack = ({ children, onLayout }: ComponentProps) => (
  <View style={tw`w-6 h-full overflow-hidden rounded-full bg-primary-background-dark`}>
    <Shadow shadow={innerShadow} style={tw`w-full p-0.5 h-full rounded-full`}>
      <View style={tw`h-full`} {...{ onLayout }}>
        {children}
      </View>
    </Shadow>
  </View>
)
