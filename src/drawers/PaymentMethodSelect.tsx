import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine, Icon, PaymentLogo, Text } from '../components'
import { PaymentLogoType } from '../components/payment/logos'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type PaymentMethodSelectProps = {
  paymentMethods: PaymentMethod[]
  onSelect: (method: PaymentMethod) => void
}
export const PaymentMethodSelect = ({ paymentMethods, onSelect }: PaymentMethodSelectProps): ReactElement => {
  const [selected, setSelected] = useState<PaymentMethod>(paymentMethods[0])

  const select = (method: PaymentMethod) => {
    setSelected(method)
  }
  const confirm = () => onSelect(selected)

  return (
    <View>
      {paymentMethods.map((method, i) => (
        <View key={method}>
          <View style={tw`flex flex-row items-center px-8`}>
            <View style={tw`p-1 mr-4 border border-black-6 rounded-lg`}>
              <PaymentLogo id={method as PaymentLogoType} style={tw`w-6 h-6`} />
            </View>
            <Text style={tw`subtitle-1 w-full flex-shrink`} onPress={() => select(method)}>
              {i18n(`paymentMethod.${method}`)}
            </Text>
            {method === selected ? <Icon id="check" style={tw`w-7 h-7`} color={tw`text-primary-light`.color} /> : null}
          </View>
          {i < paymentMethods.length - 1 ? <HorizontalLine style={tw`my-6`} /> : null}
        </View>
      ))}
      <HorizontalLine style={tw`my-6`} />
      <Text onPress={confirm} style={tw`drawer-title text-primary-light text-center`}>
        {i18n('confirm')}
      </Text>
    </View>
  )
}
