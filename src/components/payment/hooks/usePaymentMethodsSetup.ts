import { shallow } from 'zustand/shallow'
import { useNavigation, useRoute } from '../../../hooks'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { getSelectedPaymentDataIds } from '../../../utils/account'
import { isCashTrade } from '../../../utils/paymentMethod'

export const usePaymentMethodsSetup = () => {
  const navigation = useNavigation()
  const currentRouteName = useRoute().name
  const [preferredPaymentMethods, select] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.selectPaymentMethod],
    shallow,
  )
  const selectedPaymentDataIds = getSelectedPaymentDataIds(preferredPaymentMethods)

  const editItem = (data: PaymentData) => {
    if (isCashTrade(data.type)) {
      navigation.push('meetupScreen', {
        eventId: data.id.replace('cash.', ''),
        deletable: true,
        origin: currentRouteName,
      })
    } else {
      navigation.push('paymentMethodForm', {
        paymentData: data,
        origin: currentRouteName,
      })
    }
  }

  const isSelected = (itm: { value: string }) => selectedPaymentDataIds.includes(itm.value)

  return { editItem, select, isSelected }
}
