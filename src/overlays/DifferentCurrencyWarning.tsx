import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { Headline, PrimaryButton, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'

type DifferentCurrencyWarningProps = {
  currency: Currency
  paymentMethod: PaymentMethod
}

export default ({ currency, paymentMethod }: DifferentCurrencyWarningProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
        {i18n('match.differentCurrency.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-3`}>{i18n('match.differentCurrency.text.1')}</Text>
      <Text style={tw`text-center text-white-1 mt-2`}>{i18n('match.differentCurrency.text.2')}</Text>
      <PrimaryButton style={tw`mt-4`} onPress={closeOverlay}>
        {i18n('match.differentCurrency.button', currency, i18n(`paymentMethod.${paymentMethod}`))}
      </PrimaryButton>
    </View>
  )
}
