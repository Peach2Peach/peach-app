import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { PaymentMethodView } from '../inputs/paymentMethods/PaymentMethodView'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { isValidPaymentdata } from '../../utils/paymentMethod'
import { addPaymentData } from '../../utils/account'
import { Text } from '../text'
import { Item } from '../inputs'

const dummy = () => {}

type PaymentDataKeyFactsProps = ComponentProps & {
  paymentData: PaymentData,
}

export const PaymentDataKeyFacts = ({ paymentData, style }: PaymentDataKeyFactsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onPaymentDataUpdate = (data: PaymentData) => {
    addPaymentData(data)
    updateOverlay({ content: null, showCloseButton: true })
  }
  const editPaymentMethod = () => updateOverlay({
    content: <PaymentMethodView data={paymentData} onSubmit={onPaymentDataUpdate} />,
    showCloseIcon: false,
    showCloseButton: false
  })

  const isValid = isValidPaymentdata(paymentData)

  return <Pressable onPress={editPaymentMethod} style={style}>
    <Text style={!isValid ? tw`text-red` : {}}>{paymentData.label || paymentData.id}</Text>
    <View style={tw`flex-row mt-2`}>
      <Item style={tw`h-5 px-1 mr-2`} label={paymentData.type} isSelected={false} onPress={dummy} />
      {(paymentData.currencies || []).map(currency => <Item style={tw`h-5 px-1 mx-px`}
        key={currency}
        label={currency}
        isSelected={true}
        onPress={dummy}
      />)}
    </View>
  </Pressable>
}