import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext, { getBitcoinContext } from '../../utils/bitcoin'
import { SellViewProps } from './Sell'
import { updateSettings } from '../../utils/account'
import Premium from './components/Premium'
import Currencies from '../../components/inputs/Currencies'
import KYC from './components/KYC'
import PaymentMethodSelection from './components/PaymentMethodSelection'
import i18n from '../../utils/i18n'
import { Title } from '../../components'
import { debounce } from '../../utils/performance'

type UpdateOfferProps = {
  currencies: Currency[],
  paymentData: PaymentData[],
  premium: number,
  kyc: boolean,
  kycType: KYCType,
}
const validate = (offer: SellOffer) =>
  !!offer.amount
  && offer.currencies.length > 0
  && offer.paymentData?.length > 0

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const { currency, price } = getBitcoinContext()
  const [currencies, setCurrencies] = useState(offer.currencies)
  const [premium, setPremium] = useState(offer.premium)
  const [paymentData, setPaymentData] = useState(offer.paymentData)
  const [kyc, setKYC] = useState(offer.kyc)
  const [kycType, setKYCType] = useState(offer.kycType)

  const debounced = useRef(debounce((deps: UpdateOfferProps) => {
    const selectedPaymentData = deps.paymentData.filter(data => data.selected)

    updateOffer({
      ...offer,
      currencies: deps.currencies,
      paymentData: selectedPaymentData,
      paymentMethods: selectedPaymentData.map(p => p.type),
      premium: deps.premium,
      kyc: deps.kyc,
      kycType: deps.kycType,
    })
    updateSettings({
      currencies: deps.currencies,
      premium: deps.premium,
      kyc: deps.kyc,
      kycType: deps.kycType,
    })
  }, 300))

  const deps: AnyObject = { currencies, paymentData, premium, kyc, kycType }
  useEffect(() => debounced.current(deps), Object.keys(deps).map(dep => deps[dep]))

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