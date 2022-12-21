import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { SellViewProps } from './SellPreferences'
import { account, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../utils/account'
import Premium from './components/Premium'
import i18n from '../../utils/i18n'
import { Headline, Title } from '../../components'
import { hasMopsConfigured } from '../../utils/offer'
import { getPaymentMethods, hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { EditIcon, HelpIcon } from '../../components/icons'
import { useHeaderSetup } from '../../hooks'
import { isDefined } from '../../utils/array/isDefined'

const validate = (offer: SellOffer) => {
  if (!offer.amount || !hasMopsConfigured(offer)) return false

  const paymentMethods = getPaymentMethods(offer.meansOfPayment)
  if (!paymentMethods.every((p) => offer.paymentData[p])) return false

  const selectedPaymentMethods = Object.keys(offer.paymentData)
  if (selectedPaymentMethods.length === 0) return false

  const paymentDataValid = getSelectedPaymentDataIds().map(getPaymentData)
    .filter(isDefined)
    .every(isValidPaymentData)
  return paymentDataValid
}

export const headerIcons = [
  {
    iconComponent: <EditIcon />,
    onPress: () => null,
  },
  { iconComponent: <HelpIcon />, onPress: () => null },
]

const headerConfig = { title: i18n('settings.paymentMethods'), icons: headerIcons }

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  useHeaderSetup(headerConfig)
  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(
    offer.meansOfPayment || account.settings.meansOfPayment,
  )
  const [premium, setPremium] = useState(offer.premium)

  const saveAndUpdate = (offr: SellOffer) => {
    updateOffer({
      ...offr,
      meansOfPayment,
    })
    updateSettings(
      {
        meansOfPayment: offr.meansOfPayment,
        premium: offr.premium,
        kyc: offr.kyc,
        kycType: offr.kycType,
      },
      true,
    )
  }

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

    saveAndUpdate({
      ...offer,
      meansOfPayment,
      paymentData,
      originalPaymentData: getSelectedPaymentDataIds().map(getPaymentData) as PaymentData[],
      premium,
    })
  }, [meansOfPayment, premium])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return (
    <View style={tw`mb-16 px-6`}>
      <Title title={i18n('sell.title')} />
      <Headline style={tw`mt-16 text-grey-1`}>{i18n('sell.meansOfPayment')}</Headline>
      <PaymentDetails style={tw`mt-4`} paymentData={account.paymentData} setMeansOfPayment={setMeansOfPayment} />
      <AddPaymentMethodButton origin={['sellPreferences', { amount: offer.amount }]} style={tw`mt-4`} />

      <Premium {...{ offer, premium, setPremium }} />
    </View>
  )
}
