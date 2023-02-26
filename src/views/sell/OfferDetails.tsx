import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import shallow from 'zustand/shallow'
import { Icon, PeachScrollView, PrimaryButton } from '../../components'
import { EditIcon, HelpIcon } from '../../components/icons'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { useHeaderSetup } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import { useSettingsStore } from '../../store/settingsStore'
import { account, getPaymentData, getSelectedPaymentDataIds } from '../../utils/account'
import { isDefined } from '../../utils/array/isDefined'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'
import { getPaymentMethods, hashPaymentData, isValidPaymentData } from '../../utils/paymentMethod'
import { SellViewProps } from './SellPreferences'

const validate = (offer: SellOfferDraft) => {
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

export default ({ offerDraft, setOfferDraft, next }: SellViewProps): ReactElement => {
  const [editing, setEditing] = useState(false)
  const [setMeansOfPaymentStore] = useSettingsStore((state) => [state.setMeansOfPayment], shallow)
  const [stepValid, setStepValid] = useState(false)

  const showHelp = useShowHelp('paymentMethods')

  useHeaderSetup({
    title: i18n(editing ? 'paymentMethods.edit.title' : 'paymentMethods.title'),
    icons:
      account.paymentData.length !== 0
        ? [
          {
            iconComponent: editing ? <Icon id="checkboxMark" /> : <EditIcon />,
            onPress: () => {
              setEditing(!editing)
            },
          },
          { iconComponent: <HelpIcon />, onPress: showHelp },
        ]
        : [{ iconComponent: <HelpIcon />, onPress: showHelp }],
  })
  const [meansOfPayment, setMeansOfPayment] = useState<MeansOfPayment>(
    offerDraft.meansOfPayment || account.settings.meansOfPayment,
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
    setOfferDraft((prev) => ({
      ...prev,
      meansOfPayment,
      paymentData,
    }))
    setMeansOfPaymentStore(meansOfPayment)
  }, [meansOfPayment, setMeansOfPaymentStore, setOfferDraft])

  useEffect(() => setStepValid(validate(offerDraft)), [offerDraft])

  return (
    <View style={tw`items-center flex-shrink h-full p-5 pb-7`}>
      <PeachScrollView style={[tw`flex-shrink h-full mb-10`]}>
        <PaymentDetails
          style={tw`mt-4`}
          paymentData={account.paymentData}
          setMeansOfPayment={setMeansOfPayment}
          editing={editing}
          origin="sellPreferences"
        />
      </PeachScrollView>
      <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
