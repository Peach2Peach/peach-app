import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PaymentMethodText } from './PaymentMethodText'

type Props = {
  paymentMethod: PaymentMethod
  isSelected?: boolean
  isVerified?: boolean
} & ComponentProps

export const PaymentMethod = ({ paymentMethod, isSelected = false, isVerified = false, style }: Props) => (
  <View
    style={[
      tw`flex-row items-center px-2 border rounded-lg border-black-1 button-medium`,
      isSelected && tw`bg-primary-main`,
      style,
    ]}
  >
    <PaymentMethodText {...{ paymentMethod, isSelected, isVerified }} />
  </View>
)
