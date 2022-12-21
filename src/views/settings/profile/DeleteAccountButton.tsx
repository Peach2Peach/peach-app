import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'

export const DeleteAccountButton = ({ style }: ComponentProps) => (
  <TouchableOpacity style={[tw`flex-row items-center`, style]}>
    <Text style={tw`subtitle-1 text-error-main`}>delete account</Text>
    <Icon id="trash2" color={tw`text-error-main`.color} style={tw`w-4 h-4 ml-4`} />
  </TouchableOpacity>
)
