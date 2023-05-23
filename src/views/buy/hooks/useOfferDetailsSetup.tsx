import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useShowHelp, useToggleBoolean } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getPaymentData, getSelectedPaymentDataIds } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { hashPaymentData } from '../../../utils/paymentMethod'
import { validateOfferDetailsStep } from '../helpers/validateOfferDetailsStep'

type Props = {
  offerDraft: BuyOfferDraft
  setOfferDraft: Dispatch<SetStateAction<BuyOfferDraft>>
}
export const useOfferDetailsSetup = ({ offerDraft, setOfferDraft }: Props) => {
  const [isEditing, toggleIsEditing] = useToggleBoolean(false)
  const [isStepValid, setIsStepValid] = useState(false)
  const [meansOfPayment, setMeansOfPayment, preferredPaymentMethods] = useSettingsStore(
    (state) => [state.meansOfPayment, state.setMeansOfPayment, state.preferredPaymentMethods],
    shallow,
  )
  const showHelp = useShowHelp('paymentMethods')

  useHeaderSetup({
    title: i18n(isEditing ? 'paymentMethods.edit.title' : 'paymentMethods.title'),
    icons:
      account.paymentData.length !== 0
        ? [
          {
            ...(isEditing ? headerIcons.checkbox : headerIcons.edit),
            onPress: toggleIsEditing,
          },
          { ...headerIcons.help, onPress: showHelp },
        ]
        : [{ ...headerIcons.help, onPress: showHelp }],
  })

  useEffect(() => {
    const paymentData = getSelectedPaymentDataIds(preferredPaymentMethods)
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
      originalPaymentData: getSelectedPaymentDataIds(preferredPaymentMethods).map(getPaymentData) as PaymentData[],
    }))
  }, [meansOfPayment, preferredPaymentMethods, setOfferDraft])

  useEffect(
    () => setIsStepValid(validateOfferDetailsStep(offerDraft, preferredPaymentMethods)),
    [offerDraft, preferredPaymentMethods, setIsStepValid],
  )

  return { paymentData: account.paymentData, setMeansOfPayment, isEditing, toggleIsEditing, isStepValid }
}
