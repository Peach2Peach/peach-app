import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Title } from '../../components'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { getSelectedPaymentDataIds } from '../../utils/account'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'
import { hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import { BuyViewProps } from './BuyPreferences'
import { UserDataStore, useUserDataStore } from '../../store'
import shallow from 'zustand/shallow'

const validate = (offer: BuyOffer, getWithId: (id: string) => PaymentData) => {
  const paymentDataValid = getSelectedPaymentDataIds()
    .map(getWithId)
    .filter((d) => d)
    .every((d) => isValidPaymentData(d!))
  return !!offer.amount && hasMopsConfigured(offer) && paymentDataValid
}

const offerDetailsSelector = (state: UserDataStore) => ({
  accountMeansOfPayment: state.settings.meansOfPayment,
  getWithId: state.getPaymentDataById,
  updateSettings: state.updateSettings,
})

export default ({ offer, updateOffer, setStepValid, navigation }: BuyViewProps): ReactElement => {
  const { accountMeansOfPayment, getWithId, updateSettings } = useUserDataStore(offerDetailsSelector, shallow)
  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(offer.meansOfPayment || accountMeansOfPayment)

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
    updateOffer({
      ...offer,
      meansOfPayment,
      paymentData,
      originalPaymentData: getSelectedPaymentDataIds().map(getWithId) as PaymentData[],
    })
    updateSettings({
      meansOfPayment,
      kyc: offer.kyc,
    })
  }, [getWithId, meansOfPayment, updateSettings])

  useEffect(() => setStepValid(validate(offer, getWithId)), [getWithId, offer])

  return (
    <View style={tw`mb-16 px-6`}>
      <Title title={i18n('buy.title')} />
      <Headline style={tw`mt-16 text-grey-1`}>{i18n('buy.meansOfPayment')}</Headline>
      <PaymentDetails style={tw`mt-4`} setMeansOfPayment={setMeansOfPayment} />
      <AddPaymentMethodButton
        navigation={navigation}
        origin={['buyPreferences', { amount: offer.amount }]}
        style={tw`mt-4`}
      />
    </View>
  )
}
