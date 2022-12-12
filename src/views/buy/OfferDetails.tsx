import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Title } from '../../components'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { getPaymentData, getSelectedPaymentDataIds } from '../../utils/account'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'
import { hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import { useAccountStore } from '../../utils/storage/accountStorage'
import { BuyViewProps } from './BuyPreferences'

const validate = (offer: BuyOffer) => {
  const paymentDataValid = getSelectedPaymentDataIds()
    .map(getPaymentData)
    .filter((d) => d)
    .every((d) => isValidPaymentData(d!))
  return !!offer.amount && hasMopsConfigured(offer) && paymentDataValid
}

export default ({ offer, updateOffer, setStepValid, navigation }: BuyViewProps): ReactElement => {
  const account = useAccountStore()
  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(
    offer.meansOfPayment || account.settings.meansOfPayment,
  )

  useEffect(() => {
    const paymentData = getSelectedPaymentDataIds()
      .map(getPaymentData)
      .reduce((obj, data) => {
        if (!data) return obj
        obj[data.type] = {
          hash: hashPaymentData(data),
          country: data.country,
        }
        return obj
      }, {} as Offer['paymentData'])
    updateOffer({
      ...offer,
      meansOfPayment,
      paymentData,
      originalPaymentData: getSelectedPaymentDataIds().map(getPaymentData) as PaymentData[],
    })
    account.updateSettings({
      meansOfPayment,
      kyc: offer.kyc,
    })
  }, [account, meansOfPayment])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return (
    <View style={tw`mb-16 px-6`}>
      <Title title={i18n('buy.title')} />
      <Headline style={tw`mt-16 text-grey-1`}>{i18n('buy.meansOfPayment')}</Headline>
      <PaymentDetails style={tw`mt-4`} paymentData={account.paymentData} setMeansOfPayment={setMeansOfPayment} />
      <AddPaymentMethodButton
        navigation={navigation}
        origin={['buyPreferences', { amount: offer.amount }]}
        style={tw`mt-4`}
      />
    </View>
  )
}
