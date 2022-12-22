import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { BuyViewProps } from './BuyPreferences'
import { account, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { Headline, Title } from '../../components'
import { hasMopsConfigured } from '../../utils/offer'
import { hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import PaymentDetails from '../../components/payment/PaymentDetails'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import { EditIcon, HelpIcon } from '../../components/icons'
import { useHeaderSetup } from '../../hooks'
import { isDefined } from '../../utils/array/isDefined'

const validate = (offer: BuyOffer) =>
  !!offer.amount
  && hasMopsConfigured(offer)
  && getSelectedPaymentDataIds().map(getPaymentData)
    .filter(isDefined)
    .every(isValidPaymentData)

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [editing, setEditing] = useState(false)

  const headerIcons = [
    {
      iconComponent: <EditIcon />,
      onPress: () => {
        setEditing(!editing)
      },
    },
    { iconComponent: <HelpIcon />, onPress: () => null },
  ]
  const headerConfig = { title: i18n('settings.paymentMethods'), icons: headerIcons }

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
      originalPaymentData: getSelectedPaymentDataIds().map(getPaymentData) as PaymentData[],
    })
    updateSettings(
      {
        meansOfPayment,
        kyc: offer.kyc,
      },
      true,
    )
  }, [meansOfPayment])

  useEffect(() => setStepValid(validate(offer)), [offer])

  return (
    <View style={tw`mb-16 px-6`}>
      <Title title={i18n('buy.title')} />
      <Headline style={tw`mt-16 text-grey-1`}>{i18n('buy.meansOfPayment')}</Headline>
      <PaymentDetails
        style={tw`mt-4`}
        paymentData={account.paymentData}
        setMeansOfPayment={setMeansOfPayment}
        editing={editing}
      />
      <AddPaymentMethodButton origin={['buyPreferences', { amount: offer.amount }]} style={tw`mt-4`} />
    </View>
  )
}
