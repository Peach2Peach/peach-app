import React, { ReactElement, useContext, useEffect, useState, useRef } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, HorizontalLine, Icon, PeachScrollView, Text } from '../components'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { getCurrencies, toMeansOfPayment } from '../utils/paymentMethod'
import { Currencies, PaymentMethods, } from '../components/inputs'
import CurrencySelect from './CurrencySelect'

const isValid = (meansOfPayment: MeansOfPayment) =>
  getCurrencies(meansOfPayment).some(currency => meansOfPayment[currency]!.length > 0)
type PaymentMethodSelectProps = {
  currencies: Currency[],
  meansOfPayment?: MeansOfPayment,
  onConfirm: (meansOfPayment: MeansOfPayment) => void
}

// eslint-disable-next-line max-lines-per-function
export const PaymentMethodSelect = ({
  currencies,
  meansOfPayment,
  onConfirm
}: PaymentMethodSelectProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [mops, setMeansOfPayment] = useState<MeansOfPayment>(meansOfPayment || currencies.reduce(toMeansOfPayment, {}))
  const stepValid = isValid(mops)
  const scroll = useRef<ScrollView>(null)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const togglePaymentMethod = (currency: Currency, paymentMethod: PaymentMethod) => {
    setMeansOfPayment(state => {
      if (!state[currency]) state[currency] = []

      if (state[currency]!.indexOf(paymentMethod) !== -1) {
        state[currency] = state[currency]?.filter(p => p !== paymentMethod)
      } else {
        state[currency]!.push(paymentMethod)
      }

      return { ...state }
    })
  }

  const confirm = () => {
    closeOverlay()
    onConfirm(mops)
  }

  const onCurrencySelect = (selection: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={selection} meansOfPayment={mops} onConfirm={onConfirm} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const onCountrySelect = () => updateOverlay({
    content: <PaymentMethodSelect meansOfPayment={mops}
      currencies={Object.keys(mops) as Currency[]}
      onConfirm={onConfirm} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const goBack = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} currencies={currencies} view="buyer" />,
    showCloseIcon: true,
    showCloseButton: false
  })

  useEffect(() => {
    scroll.current?.flashScrollIndicators()
  }, [])

  return <View style={tw`w-full h-full pt-14 pb-8 flex items-center justify-between`}>
    <View style={tw`w-full flex-shrink-0`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('paymentMethod.select.title')}
      </Headline>
    </View>
    <PeachScrollView scrollRef={scroll} style={tw`px-10 h-full flex-shrink`}>
      <Currencies
        currencies={currencies}
        onChange={(c) => setSelectedCurrency(c)}
        selected={selectedCurrency}
        meansOfPayment={mops}
        invertColors={true}
      />
      <PaymentMethods
        style={tw`mt-14`}
        meansOfPayment={mops}
        currency={selectedCurrency}
        onChange={(currency, paymentMethod) => togglePaymentMethod(currency, paymentMethod)}
        onCountrySelect={onCountrySelect}
        invertColors={true}
      />
    </PeachScrollView>
    <View style={tw`w-full flex-shrink-0`}>
      <View style={tw`px-10`}>
        <HorizontalLine style={tw`bg-white-1 mt-4`}/>
      </View>
      <Text style={[
        tw`font-baloo text-sm uppercase text-white-1 text-center mt-3`,
        stepValid ? tw`opacity-0` : tw`opacity-70`
      ]}>
        {i18n('paymentMethod.select.disclaimer')}
      </Text>
      <View style={tw`w-full mt-2 flex items-center`}>
        <Pressable style={tw`absolute left-0`} onPress={goBack}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('confirm')}
          secondary={true}
          disabled={!stepValid}
          onPress={confirm}
          wide={false}
        />
      </View>
    </View>
  </View>
}

export default PaymentMethodSelect