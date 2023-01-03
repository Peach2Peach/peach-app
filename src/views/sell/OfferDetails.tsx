import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { EditIcon, HelpIcon } from '../../components/icons'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import PaymentDetails from '../../components/payment/PaymentDetails'
import LanguageContext from '../../contexts/language'
import { useHeaderSetup } from '../../hooks'
import { account, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../utils/account'
import { isDefined } from '../../utils/array/isDefined'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'
import { getPaymentMethods, hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import Premium from './components/Premium'
import { SellViewProps } from './SellPreferences'

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

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  const [editing, setEditing] = useState(false)

  const headerConfig = {
    title: i18n('settings.paymentMethods'),
    icons: [
      {
        iconComponent: <EditIcon />,
        onPress: () => {
          setEditing(!editing)
        },
      },
      { iconComponent: <HelpIcon />, onPress: () => null },
    ],
  }
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
      <PaymentDetails
        style={tw`mt-4`}
        paymentData={account.paymentData}
        setMeansOfPayment={setMeansOfPayment}
        editing={editing}
      />
      <AddPaymentMethodButton origin={['sellPreferences', { amount: offer.amount }]} style={tw`mt-4`} />

      <Premium {...{ offer, premium, setPremium }} />
    </View>
  )
}
