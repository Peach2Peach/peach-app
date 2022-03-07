import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext, { getBitcoinContext } from '../../utils/bitcoinUtils'
import { SellViewProps } from './Sell'
import { account, updateSettings } from '../../utils/accountUtils'
import Premium from './components/Premium'
import Currencies from '../../components/inputs/Currencies'
import KYC from './components/KYC'
import PaymentMethodSelection from './components/PaymentMethodSelection'
import i18n from '../../utils/i18n'
import { Title } from '../../components'
import { debounce } from '../../utils/performanceUtils'

const validate = (offer: SellOffer) =>
  !!offer.amount
  && offer.currencies.length > 0
  && offer.paymentData.length > 0

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const { currency, price } = getBitcoinContext()
  const [currencies, setCurrencies] = useState(account.settings.currencies || [])
  const [premium, setPremium] = useState(account.settings.premium || 1.5)
  const [paymentData, setPaymentData] = useState(account.paymentData || [])
  const [kyc, setKYC] = useState(account.settings.kyc || false)
  const [kycType, setKYCType] = useState(account.settings.kycType || 'iban')

  useEffect(useCallback(debounce(() => {
    updateOffer({
      ...offer,
      currencies,
      paymentData: paymentData.filter(data => data.selected),
      premium,
      kyc,
      kycType,
    })
    updateSettings({
      currencies,
      premium,
      kyc,
      kycType,
    })
  }, 300), []), [currencies, paymentData, premium, kyc, kycType])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return <View style={tw`mb-16`}>
    <Title title={i18n('sell.title')} />
    <Currencies title={i18n('sell.currencies')} currencies={currencies} setCurrencies={setCurrencies} />
    <PaymentMethodSelection setPaymentData={setPaymentData} />
    <Premium
      premium={premium}
      setPremium={setPremium}
      identifier={`${currencies.join()}${paymentData.join()}${kyc}`}
      offer={offer}
      currency={currency}
      price={price}
    />
    <KYC kyc={kyc} setKYC={setKYC} kycType={kycType} setKYCType={setKYCType} />
  </View>
}