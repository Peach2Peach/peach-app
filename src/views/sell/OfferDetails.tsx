import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { SellViewProps } from './Sell'
import { account, updateSettings } from '../../utils/account'
import Premium from './components/Premium'
import KYC from './components/KYC'
import i18n from '../../utils/i18n'
import { Headline, Title, PaymentMethods } from '../../components'
import { debounce } from '../../utils/performance'
import { hasMopsConfigured } from '../../utils/offer'
import { MeansOfPayment } from '../../components/inputs'
import { getPaymentMethods } from '../../utils/paymentMethod'

type UpdateOfferProps = {
  premium: number,
}
const validate = (offer: SellOffer) =>
  !!offer.amount
  && hasMopsConfigured(offer)
  && offer.paymentData?.length > 0

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(offer.meansOfPayment)
  const [premium, setPremium] = useState(offer.premium)
  const [paymentData, setPaymentData] = useState(offer.paymentData)
  const [kyc, setKYC] = useState(offer.kyc)
  const [kycType, setKYCType] = useState(offer.kycType)

  const saveAndUpdate = (offr: SellOffer) => {
    updateOffer(offr)
    updateSettings({
      meansOfPayment: offr.meansOfPayment,
      premium: offr.premium,
      kyc: offr.kyc,
      kycType: offr.kycType,
    })
  }
  const debounced = useRef(debounce((deps: UpdateOfferProps) => {
    saveAndUpdate({
      ...offer,
      premium: deps.premium,
    })
  }, 300))

  const deps: AnyObject = { premium }
  useEffect(() => debounced.current(deps), Object.keys(deps).map(dep => deps[dep]))
  useEffect(() => {
    const selectedPaymentData = paymentData.filter(data => data.selected)

    saveAndUpdate({
      ...offer,
      meansOfPayment,
      paymentData: selectedPaymentData,
      kyc,
      kycType,
    })
  }, [meansOfPayment, paymentData, kyc, kycType])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return <View style={tw`mb-16 px-6`}>
    <Title title={i18n('sell.title')} />
    <Headline style={tw`mt-16 text-grey-1`}>
      {i18n('sell.meansOfPayment')}
    </Headline>
    <MeansOfPayment meansOfPayment={meansOfPayment} setMeansOfPayment={setMeansOfPayment} />
    <PaymentMethods paymentData={account.paymentData}
      selectedPaymentMethods={getPaymentMethods(meansOfPayment)}
      showCheckBoxes={false}
      onChange={(updatedPaymentData: PaymentData[]) => setPaymentData(updatedPaymentData)}/>
    <Premium
      premium={premium}
      setPremium={setPremium}
      identifier={`${Object.keys(meansOfPayment).join()}${paymentData.join()}${kyc}`}
      offer={offer}
    />
    {/* <KYC kyc={kyc} setKYC={setKYC} kycType={kycType} setKYCType={setKYCType} /> */}
  </View>
}