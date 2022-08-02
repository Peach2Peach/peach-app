import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine, Icon, PaymentLogo, Text } from '../components'
import { PaymentLogoType } from '../components/payment/logos'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type PaymentMethodSelectProps = {
  paymentMethods: PaymentMethod[],
  showLogos?: boolean,
  onSelect: (method: PaymentMethod) => void,
}
export const PaymentMethodSelect = ({ paymentMethods, showLogos, onSelect }: PaymentMethodSelectProps): ReactElement => {
  const [selected, setSelected] = useState<PaymentMethod>()

  const select = (method: PaymentMethod) => {
    setSelected(method)
    onSelect(method)
  }

  useEffect(() => {
    setSelected(undefined)
  }, [])

  return <View>
    {paymentMethods.map((method, i) => <View key={method}>
      <View style={tw`flex flex-row items-center px-8`}>
        {showLogos && <PaymentLogo id={method as PaymentLogoType} style={tw`w-8 h-8 mr-4`} />}
        <Text style={tw`font-baloo text-base uppercase w-full flex-shrink`}
          onPress={() => select(method)}>
          {i18n(`paymentMethod.${method}`)}
        </Text>
        {method === selected
          ? <Icon id="check" style={tw`w-7 h-7`} color={tw`text-peach-1`.color as string} />
          : null
        }
      </View>
      {i < paymentMethods.length - 1 ? <HorizontalLine style={tw`my-6`}/> : null}
    </View>
    )}
  </View>
}