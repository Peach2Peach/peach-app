import { useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'

export const usePaymentMethodFormSetup = () => {
  const { paymentData, origin } = useRoute<'paymentMethodForm'>().params
  const goBackTo = useGoToOrigin()
  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)
  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const onSubmit = (data: PaymentData) => {
    addPaymentData(data)
    selectPaymentMethod(data.id)
    goBackTo(origin)
  }

  return { onSubmit, data: paymentData }
}
