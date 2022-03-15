import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { BuyViewProps } from './Buy'
import { updateSettings } from '../../utils/account'
import KYC from './components/KYC'
import i18n from '../../utils/i18n'
import Currencies from '../../components/inputs/Currencies'
import PaymentMethodSelection from './components/PaymentMethodSelection'
import { Title } from '../../components'

const validate = (offer: BuyOffer) =>
  !!offer.amount
  && offer.currencies.length > 0
  && offer.paymentMethods.length > 0

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  useContext(LanguageContext)

  const [currencies, setCurrencies] = useState<Currency[]>(offer.currencies)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(offer.paymentMethods)
  const [kyc, setKYC] = useState(offer.kyc)

  useEffect(() => {
    updateOffer({
      ...offer,
      currencies,
      paymentMethods,
      kyc,
    })
    updateSettings({
      currencies,
      paymentMethods,
      kyc
    })
  }, [currencies, paymentMethods, kyc])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return <View style={tw`mb-16`}>
    <Title title={i18n('buy.title')} />
    <Currencies title={i18n('buy.currencies')} currencies={currencies} setCurrencies={setCurrencies} />
    <PaymentMethodSelection paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} />
    <KYC kyc={kyc} setKYC={setKYC} />
  </View>
}