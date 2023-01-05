import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { BuyViewProps } from './BuyPreferences'
import { account, getPaymentData, getSelectedPaymentDataIds, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { Icon } from '../../components'
import { hasMopsConfigured } from '../../utils/offer'
import { hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import PaymentDetails from '../../components/payment/PaymentDetails'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import { EditIcon, HelpIcon } from '../../components/icons'
import { useHeaderSetup } from '../../hooks'
import { isDefined } from '../../utils/array/isDefined'
import { HeaderConfig } from '../../components/header/store'

const validate = (offer: BuyOffer) =>
  !!offer.amount
  && hasMopsConfigured(offer)
  && getSelectedPaymentDataIds().map(getPaymentData)
    .filter(isDefined)
    .every(isValidPaymentData)

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [editing, setEditing] = useState(false)

  const headerIcons = [
    account.paymentData.length !== 0 && {
      iconComponent: editing ? <Icon id="checkboxMark" /> : <EditIcon />,
      onPress: () => {
        setEditing(!editing)
      },
    },
    { iconComponent: <HelpIcon />, onPress: () => null },
  ]
  const headerConfig = { title: i18n('settings.paymentMethods'), icons: headerIcons } as HeaderConfig

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
    <View>
      <PaymentDetails
        style={tw`mt-4`}
        paymentData={account.paymentData}
        setMeansOfPayment={setMeansOfPayment}
        editing={editing}
      />
      <View style={tw`bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['buyPreferences', { amount: offer.amount }]} />
    </View>
  )
}
