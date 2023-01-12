import React from 'react'
import { View } from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'

type BulletPointProps = { text: String }

export const BulletPoint = ({ text }: BulletPointProps) => (
  <View style={tw`flex-row pl-3`}>
    <Text style={tw`text-xl body-m`}>· </Text>
    <Text style={tw`body-m`}>{text}</Text>
  </View>
)
