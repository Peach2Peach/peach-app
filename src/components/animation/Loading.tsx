import React, { ReactElement } from 'react'
import { ActivityIndicator, View } from 'react-native'
import tw from '../../styles/tailwind'

type LoadingProps = {
  color?: string,
  size?: 'small' | 'large'
}
export const Loading = ({ color, size = 'large' }: LoadingProps): ReactElement =>
  <View style={tw`h-full w-full flex justify-center items-center`}>
    <ActivityIndicator
      size={size}
      color={color ? color : tw`text-peach-1`.color as string}
    />
  </View>