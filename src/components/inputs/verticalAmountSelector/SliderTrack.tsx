import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'

export const SliderTrack = ({ style, children, onLayout }: ComponentProps) => (
  <View style={[tw`w-8 rounded-full bg-primary-background-dark`, { height: style.height + 10 }]}>
    <View style={tw`h-full m-[5px]`} {...{ onLayout }}>
      {children}
    </View>
  </View>
)
