import React, { useContext } from 'react'
import { View } from 'react-native'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Headline } from '../../text'
import { PaymentMethodForm } from './paymentForms'

type AddPaymentMethodProps = {
  paymentMethod: PaymentMethod,
  currencies: Currency[],
  onSubmit: (data: PaymentData) => void
}

export const AddPaymentMethod = ({ paymentMethod, currencies, onSubmit }: AddPaymentMethodProps) => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  return <View style={tw`h-full w-full flex justify-center`}>
    <View style={tw`h-5/6 w-full flex-col`}>
      <Headline style={tw`h-28 text-white-1 text-3xl leading-5xl`}>
        {i18n('form.paymentMethod.details', i18n(`paymentMethod.${paymentMethod}`))}
      </Headline>
      <PaymentMethodForm paymentMethod={paymentMethod}
        style={tw`h-full flex-shrink flex-col justify-between`}
        view="new"
        currencies={currencies}
        onSubmit={onSubmit}
        onCancel={closeOverlay}
      />
    </View>
  </View>
}

export default AddPaymentMethod