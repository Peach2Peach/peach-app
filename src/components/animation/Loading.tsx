import React, { ReactElement } from 'react'
import { ActivityIndicator, View } from 'react-native'
import tw from '../../styles/tailwind'

export const Loading = (): ReactElement => <View style={tw`h-full w-full flex justify-center items-center`}>
  <ActivityIndicator
    size="large"
    color={tw`text-peach-1`.color as string}
  />
</View>
