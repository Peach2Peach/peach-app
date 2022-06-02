import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Card, Headline, HorizontalLine, Icon, PeachScrollView, Text } from '../components'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { getApplicablePaymentCategories, getCurrencies } from '../utils/paymentMethod'
import { Currencies, PaymentMethods, } from '../components/inputs'
import CurrencySelect from './CurrencySelect'

const isValid = (meansOfPayment: MeansOfPayment) => getCurrencies(meansOfPayment).some(currency => meansOfPayment[currency]!.length > 0)
type PaymentMethodSelectProps = {
  currencies: Currency[],
  onConfirm: (meansOfPayment: MeansOfPayment) => void
}

// eslint-disable-next-line max-lines-per-function
export const PaymentMethodSelect = ({ currencies, onConfirm }: PaymentMethodSelectProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [applicablePaymentCategories, setApplicablePaymentCategories] = useState(() =>
    getApplicablePaymentCategories(selectedCurrency)
  )
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<PaymentCategory>(
    applicablePaymentCategories[0]
  )
  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>({})
  const stepValid = isValid(meansOfPayment)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  useEffect(() => {
    console.log(meansOfPayment)
  }, [meansOfPayment])
  const togglePaymentMethod = (currency: Currency, paymentMethod: PaymentMethod) => {
    setMeansOfPayment(mops => {
      if (!mops[currency]) mops[currency] = []

      if (mops[currency]?.indexOf(paymentMethod) !== -1) {
        mops[currency] = mops[currency]?.filter(p => p !== paymentMethod)
      } else {
        mops[currency]?.push(paymentMethod)
      }

      return { ...mops }
    })
  }

  const confirm = () => {
    onConfirm(meansOfPayment)
    closeOverlay()
  }

  const onCurrencySelect = (selection: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={selection} onConfirm={onConfirm} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const onCountrySelect = () => updateOverlay({
    content: <PaymentMethodSelect currencies={currencies} onConfirm={onConfirm} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const goBack = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} currencies={currencies} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  return <View style={tw`w-full h-full pt-14 pb-8 flex items-center justify-between`}>
    <View style={tw`w-full`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('paymentMethod.select.title')}
      </Headline>
      <PeachScrollView style={tw`px-10`}>
        <Currencies
          currencies={currencies}
          onChange={(c) => setSelectedCurrency(c)}
          selected={selectedCurrency}
          meansOfPayment={meansOfPayment}
          invertColors={true}
        />
        <PaymentMethods
          style={tw`mt-14`}
          meansOfPayment={meansOfPayment}
          currency={selectedCurrency}
          onChange={(currency, paymentMethod) => togglePaymentMethod(currency, paymentMethod)}
          onCountrySelect={onCountrySelect}
          invertColors={true}
        />
      </PeachScrollView>
    </View>
    <View style={tw`w-full`}>
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