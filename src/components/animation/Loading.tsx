import React, { ReactElement } from 'react'
import { ActivityIndicator, View } from 'react-native'
import tw from '../../styles/tailwind'

type LoadingProps = ComponentProps & {
  color?: string,
  size?: 'small' | 'large'
}
export const Loading = ({ style, color, size = 'large' }: LoadingProps): ReactElement =>
  <View style={[tw`h-full w-full flex justify-center items-center`, style]}>
    <ActivityIndicator
      size={size}
      color={color ? color : tw`text-peach-1`.color as string}
    />
  </View>