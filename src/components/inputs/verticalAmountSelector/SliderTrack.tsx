import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'

export const SliderTrack = ({ style, children, onLayout }: ComponentProps) => (
  <View
    style={[
      tw`rounded-full w-[32px] bg-primary-background-dark `,
      tw`border border-primary-mild-1`,
      { height: style.height + 12 },
    ]}
  >
    <View style={tw`h-full m-[5px]`} {...{ onLayout }}>
      {children}
    </View>
  </View>
)
