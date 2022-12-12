import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Title } from '../../components'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { getSelectedPaymentDataIds } from '../../utils/account'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'
import { getPaymentMethods, hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import Premium from './components/Premium'
import { SellViewProps } from './SellPreferences'
import { usePaymentDataStore, useAccountStore } from '../../utils/storage'

const validate = (offer: SellOffer, getWithId: (id: string) => PaymentData) => {
  const paymentMethods = getPaymentMethods(offer.meansOfPayment)
  const selectedPaymentMethods = Object.keys(offer.paymentData)
  const paymentDataValid = getSelectedPaymentDataIds()
    .map(getWithId)
    .filter((d) => d)
    .every((d) => isValidPaymentData(d!))

  return (
    !!offer.amount
    && hasMopsConfigured(offer)
    && selectedPaymentMethods.length > 0
    && paymentMethods.every((p) => offer.paymentData[p])
    && paymentDataValid
  )
}

export default ({ offer, updateOffer, setStepValid, navigation }: SellViewProps): ReactElement => {
  const account = useAccountStore()
  const getWithId = usePaymentDataStore((state) => state.getWithId)

  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(
    offer.meansOfPayment || account.settings.meansOfPayment,
  )
  const [premium, setPremium] = useState(offer.premium)

  const saveAndUpdate = (offr: SellOffer, shield = true) => {
    updateOffer(
      {
        ...offr,
        meansOfPayment,
      },
      shield,
    )
    account.updateSettings({
      meansOfPayment: offr.meansOfPayment,
      premium: offr.premium,
      kyc: offr.kyc,
      kycType: offr.kycType,
    })
  }

  useEffect(() => {
    const paymentData = getSelectedPaymentDataIds()
      .map(getWithId)
      .reduce((obj, data) => {
        if (!data) return obj
        obj[data.type] = {
          hash: hashPaymentData(data),
          country: data.country,
        }
        return obj
      }, {} as Offer['paymentData'])

    saveAndUpdate(
      {
        ...offer,
        meansOfPayment,
        paymentData,
        originalPaymentData: getSelectedPaymentDataIds().map(getWithId) as PaymentData[],
        premium,
      },
      false,
    )
  }, [account, meansOfPayment, premium])

  useEffect(() => setStepValid(validate(offer, getWithId)), [offer])

  return (
    <View style={tw`mb-16 px-6`}>
      <Title title={i18n('sell.title')} />
      <Headline style={tw`mt-16 text-grey-1`}>{i18n('sell.meansOfPayment')}</Headline>
      <PaymentDetails style={tw`mt-4`} setMeansOfPayment={setMeansOfPayment} />
      <AddPaymentMethodButton
        navigation={navigation}
        origin={['sellPreferences', { amount: offer.amount }]}
        style={tw`mt-4`}
      />

      <Premium premium={premium} setPremium={setPremium} offer={offer} />
    </View>
  )
}
