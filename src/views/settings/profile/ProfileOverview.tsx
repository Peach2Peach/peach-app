import React from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'

export const ProfileOverview = () => (
  <View style={tw`flex-row`}>
    <View style={tw`bg-primary-mild-1 rounded-full p-[5px] items-center justify-center`}>
      <Icon id="user" color={tw`text-black-1`.color} />
    </View>
    <View style={tw`ml-4`}>
      <Text style={tw`subtitle-1 text-black-1`}>John Doe</Text>
      <Text style={tw`subtitle-1 text-black-1`}>Rating</Text>
    </View>
    <Icon id="star" color={tw`text-black-1`.color} style={tw`ml-auto`} />
    <Icon id="zap" color={tw`text-black-1`.color} style={tw`ml-auto`} />
    <Icon id="award" color={tw`text-black-1`.color} style={tw`ml-auto`} />
  </View>
)
