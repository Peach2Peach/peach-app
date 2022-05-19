import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { BuyViewProps } from './Buy'
import { updateSettings } from '../../utils/account'
import KYC from './components/KYC'
import i18n from '../../utils/i18n'
import Currencies from '../../components/inputs/Currencies'
import PaymentMethodSelection from './components/PaymentMethodSelection'
import { Headline, Title } from '../../components'
import { paymentMethodAllowedForCurrencies } from '../../utils/validation'
import BitcoinContext from '../../contexts/bitcoin'
import { MeansOfPayment } from '../../components/inputs'

const validate = (offer: BuyOffer) =>
  !!offer.amount
  && !!offer.meansOfPayment // TODO

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  useContext(LanguageContext)
  const [{ currency }] = useContext(BitcoinContext)

  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(offer.meansOfPayment)
  const [kyc, setKYC] = useState(offer.kyc)

  // useEffect(() => {
  //   setPaymentMethods(paymentMethods.filter(method => paymentMethodAllowedForCurrencies(method, currencies)))
  // }, [currencies])

  useEffect(() => {
    updateOffer({
      ...offer,
      meansOfPayment,
      kyc,
    })
    updateSettings({
      meansOfPayment,
      kyc
    }, true)
  }, [meansOfPayment, kyc])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return <View style={tw`mb-16 px-6`}>
    <Title title={i18n('buy.title')} />
    <Headline style={tw`mt-16 text-grey-1`}>
      {i18n('buy.meansOfPayment')}
    </Headline>
    <MeansOfPayment meansOfPayment={meansOfPayment} setMeansOfPayment={setMeansOfPayment} />
    {/* <KYC kyc={kyc} setKYC={setKYC} /> */}
  </View>
}