import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { innerShadow } from '../../../utils/layout'
import { Shadow } from '../../ui'

export const SliderTrack = ({ style, children, onLayout }: ComponentProps) => (
  <View style={[tw`w-6 rounded-full bg-primary-background-dark`, { height: style.height + 4 }]}>
    <Shadow shadow={innerShadow} style={tw`absolute w-full h-full overflow-hidden rounded-full`}></Shadow>
    <View style={tw`h-full m-0.5`} {...{ onLayout }}>
      {children}
    </View>
  </View>
)
