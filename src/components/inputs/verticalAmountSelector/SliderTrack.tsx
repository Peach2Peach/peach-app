import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { innerShadow } from '../../../utils/layout'
import { Shadow } from '../../ui'

export const SliderTrack = ({ style, children, onLayout }: ComponentProps) => (
  <View style={[tw`w-8 rounded-full bg-primary-background-dark`, { height: style.height + 10 }]}>
    <Shadow shadow={innerShadow} style={tw`absolute w-full h-full overflow-hidden rounded-full`}></Shadow>
    <View style={tw`h-full m-[5px]`} {...{ onLayout }}>
      {children}
    </View>
  </View>
)
