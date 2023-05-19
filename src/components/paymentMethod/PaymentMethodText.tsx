import { useMemo } from 'react'
import tw from '../../styles/tailwind'
import { getPaymentMethodName } from '../../utils/paymentMethod'
import Icon from '../Icon'
import { Text } from '../text'

type Props = {
  paymentMethod?: PaymentMethod
  isSelected?: boolean
  isVerified?: boolean
}

export const PaymentMethodText = ({ paymentMethod, isSelected = false, isVerified = false }: Props) => {
  const paymentMethodName = useMemo(
    () => (paymentMethod ? getPaymentMethodName(paymentMethod) : 'undefined'),
    [paymentMethod],
  )
  return (
    <>
      <Text style={[tw`self-center button-medium text-black-3`, isSelected && tw`text-primary-background-light`]}>
        {paymentMethodName}
      </Text>
      {isVerified && (
        <Icon
          id="userCheck"
          style={tw`w-3 h-3 ml-1`}
          color={isSelected ? tw`text-primary-background-light`.color : tw`text-black-3`.color}
        />
      )}
    </>
  )
}
