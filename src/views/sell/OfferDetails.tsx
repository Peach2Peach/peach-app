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

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  const [editing, setEditing] = useState(false)

  const headerConfig = {
    title: i18n('form.paymentMethod'),
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
    })
  }, [meansOfPayment])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return (
    <View>
      <PaymentDetails
        style={tw`mt-4`}
        paymentData={account.paymentData}
        setMeansOfPayment={setMeansOfPayment}
        editing={editing}
      />
      <View style={tw`bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['sellPreferences', { amount: offer.amount }]} />
    </View>
  )
}
