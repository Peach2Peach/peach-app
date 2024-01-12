import { useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { getPaymentMethodName } from '../../utils/paymentMethod/getPaymentMethodName'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'

type Props = {
  paymentMethod?: PaymentMethod
  isVerified?: boolean
} & ComponentProps

export const PaymentMethod = ({ paymentMethod, isVerified = false, style }: Props) => {
  const name = useMemo(() => (paymentMethod ? getPaymentMethodName(paymentMethod) : paymentMethod), [paymentMethod])
  return (
    <View style={[tw`flex-row items-center px-2 border rounded-lg border-black-100 button-medium`, style]}>
      <PeachText style={tw`button-medium`}>{name}</PeachText>
      {isVerified && <Icon id="userCheck" style={tw`w-3 h-3 ml-1`} color={tw.color('black-100')} />}
    </View>
  )
}
