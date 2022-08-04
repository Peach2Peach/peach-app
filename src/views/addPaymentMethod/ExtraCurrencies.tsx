import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Checkboxes, Headline, Icon, Text } from '../../components'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import { Navigation } from './components/Navigation'
import Currency from '../../overlays/info/Currency'
import { OverlayContext } from '../../contexts/overlay'
const { LinearGradient } = require('react-native-gradients')

type CurrencySelectProps = {
  paymentMethod: PaymentMethod,
  selected: Currency[],
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>,
  back: () => void,
  next: () => void,
}

export default ({ paymentMethod, selected, setCurrencies, back, next }: CurrencySelectProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [paymentMethodInfo] = useState(() => getPaymentMethodInfo(paymentMethod))
  const [stepValid, setStepValid] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(selected)
  const currencies = paymentMethodInfo.currencies.map(c => ({
    value: c,
    display: i18n(`currency.${c}`)
  }))

  const openCurrencyHelp = () => updateOverlay({
    content: <Currency view={'buyer'} />,
    help: true
  })

  useEffect(() => {
    setStepValid(selectedCurrencies.length > 0)
    setCurrencies(selectedCurrencies)
  }, [selectedCurrencies])

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n(
        'paymentMethod.select.title',
        i18n(`paymentMethod.${paymentMethod}`)
      )}
    </Headline>
    <View style={tw`flex-row justify-center items-center`}>
      <Text style={tw`text-center text-grey-2`}>
        {i18n(
          'paymentMethod.currency.select.subtitle',
          i18n(`paymentMethod.${paymentMethod}`)
        )}
      </Text>
      <Pressable style={tw`w-0 ml-1 mt-0.5`} onPress={openCurrencyHelp}>
        <View style={tw`w-8 h-8 flex items-center justify-center`}>
          <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
        </View>
      </Pressable>
    </View>
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      <Checkboxes items={currencies}
        selectedValues={selectedCurrencies}
        onChange={cs => setSelectedCurrencies(cs as Currency[])}
      />
    </View>
    <View style={tw`mt-4 px-6 flex items-center w-full bg-white-1`}>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
      <Navigation back={back} next={next} stepValid={stepValid} />
    </View>
  </View>
}