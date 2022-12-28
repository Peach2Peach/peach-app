import React from 'react'
import { View } from 'react-native'
import { Icon } from '../../../../../components'
import tw from '../../../../../styles/tailwind'

export const ProfileImage = () => (
  <View style={tw`bg-primary-mild-1 rounded-full w-10 h-10 items-center justify-center`}>
    <Icon id="user" color={tw`text-black-1`.color} style={tw`w-[30px] h-[30px]`} />
  </View>
)
