import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { specialTemplates } from './specialTemplates'
import { usePaymentMethodDetailsSetup } from './hooks/usePaymentMethodDetailsSetup'

export const PaymentMethodDetails = () => {
  const formProps = usePaymentMethodDetailsSetup()

  return (
    <View style={[tw`flex h-full`, specialTemplates[formProps.paymentMethod]?.style]}>
      <View style={!specialTemplates[formProps.paymentMethod] && tw`px-6`}>
        <PaymentMethodForm {...formProps} />
      </View>
    </View>
  )
}
