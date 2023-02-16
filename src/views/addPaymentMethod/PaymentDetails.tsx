import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { specialTemplates } from './specialTemplates'
import { usePaymentDetailsSetup } from './hooks/usePaymentDetailsSetup'

export default (): ReactElement => {
  const { paymentMethod, onSubmit, currencies, data } = usePaymentDetailsSetup()

  return (
    <View style={[tw`flex h-full`, specialTemplates[paymentMethod]?.style]}>
      <View style={[!specialTemplates[paymentMethod] ? tw`px-6` : {}]}>
        <PaymentMethodForm {...{ paymentMethod, onSubmit, currencies, data }} />
      </View>
    </View>
  )
}
