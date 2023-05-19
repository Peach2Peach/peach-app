import { useMemo } from 'react'
import { TextStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { getPaymentMethodName } from '../../utils/paymentMethod'
import Icon from '../Icon'
import { Text } from '../text'

type Props = {
  paymentMethod?: PaymentMethod
  isSelected?: boolean
  isVerified?: boolean
  textStyle?: TextStyle
}

export const PaymentMethodText = ({ paymentMethod, isSelected = false, isVerified = false, textStyle }: Props) => {
  const paymentMethodName = useMemo(
    () => (paymentMethod ? getPaymentMethodName(paymentMethod) : 'undefined'),
    [paymentMethod],
  )
  const text = textStyle || tw`text-black-3`
  return (
    <>
      <Text style={[tw`self-center button-medium`, text, isSelected && tw`text-primary-background-light`]}>
        {paymentMethodName}
      </Text>
      {isVerified && (
        <Icon
          id="userCheck"
          style={tw`w-3 h-3 ml-1`}
          color={isSelected ? tw`text-primary-background-light`.color : text.color}
        />
      )}
    </>
  )
}
