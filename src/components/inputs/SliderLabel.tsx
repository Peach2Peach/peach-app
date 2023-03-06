import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'

type SliderLabelProps = ComponentProps & { position: number }

export const SliderLabel = ({ position, style, children }: SliderLabelProps): ReactElement => (
  <View style={[tw`absolute items-center w-full`, { left: position }, style]}>
    <View style={tw`w-[2px] h-[10px] bg-black-1`} />
    <Text style={tw`mt-0.5 font-semibold text-center`}>{children}</Text>
  </View>
)
