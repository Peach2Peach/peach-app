import React from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

type Props = {
  paymentMethodName: string
  isVerified?: boolean
} & React.ComponentProps<typeof View>

export const PaymentMethod = ({ paymentMethodName, isVerified = false, style }: Props) => (
  <View style={[tw`flex-row items-center px-2 border rounded-lg border-black-1 button-medium`, style]}>
    <Text style={tw`button-medium`}>{paymentMethodName}</Text>
    {isVerified && <Icon id="userCheck" style={tw`w-3 h-3 ml-1`} color={tw`text-black-1`.color} />}
  </View>
)
