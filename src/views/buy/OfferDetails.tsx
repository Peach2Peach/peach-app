import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Icon } from '../../components'
import { HeaderConfig } from '../../components/header/store'
import { EditIcon, HelpIcon } from '../../components/icons'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { useHeaderSetup } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import { account, getPaymentData, getSelectedPaymentDataIds } from '../../utils/account'
import { isDefined } from '../../utils/array/isDefined'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'
import { hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import { BuyViewProps } from './BuyPreferences'
import shallow from 'zustand/shallow'

const validate = (offer: BuyOfferDraft) =>
  !!offer.amount
  && hasMopsConfigured(offer)
  && getSelectedPaymentDataIds().map(getPaymentData)
    .filter(isDefined)
    .every(isValidPaymentData)

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [editing, setEditing] = useState(false)
  const [setMeansOfPaymentStore] = useSettingsStore((state) => [state.setMeansOfPayment], shallow)
  const headerIcons = [
    account.paymentData.length !== 0 && {
      iconComponent: editing ? <Icon id="checkboxMark" /> : <EditIcon />,
      onPress: () => {
        setEditing(!editing)
      },
    },
    { iconComponent: <HelpIcon />, onPress: () => null },
  ]
  const headerConfig = { title: i18n('form.paymentMethod'), icons: headerIcons } as HeaderConfig

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
    setMeansOfPaymentStore(meansOfPayment)
  }, [meansOfPayment, setMeansOfPaymentStore, updateOffer])

  validate(offer)
  useEffect(() => setStepValid(validate(offer)), [offer, setStepValid])

  return (
    <View>
      <PaymentDetails
        style={tw`mt-4`}
        paymentData={account.paymentData}
        setMeansOfPayment={setMeansOfPayment}
        editing={editing}
        origin={['buyPreferences', { amount: offer.amount }]}
      />
    </View>
  )
}
