import { shallow } from 'zustand/shallow'
import {
  useHeaderSetup,
  useNavigation,
  usePreviousRouteName,
  useRoute,
  useShowHelp,
  useToggleBoolean,
} from '../../../hooks'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { getSelectedPaymentDataIds } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { isCashTrade } from '../../../utils/paymentMethod'

export const usePaymentMethodsSetup = () => {
  const navigation = useNavigation()
  const currentRouteName = useRoute().name
  const showHelp = useShowHelp('paymentMethods')
  const paymentData = usePaymentDataStore((state) => state.getPaymentDataArray())
  const origin = usePreviousRouteName()
  const [isEditing, toggleIsEditing] = useToggleBoolean(origin === 'settings')
  const [preferredPaymentMethods, select] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.selectPaymentMethod],
    shallow,
  )
  const selectedPaymentDataIds = getSelectedPaymentDataIds(preferredPaymentMethods)

  useHeaderSetup({
    title: i18n(isEditing ? 'paymentMethods.edit.title' : 'paymentMethods.title'),
    icons:
      paymentData.length !== 0
        ? [
          {
            ...(isEditing ? headerIcons.checkbox : headerIcons.edit),
            onPress: toggleIsEditing,
          },
          { ...headerIcons.help, onPress: showHelp },
        ]
        : [{ ...headerIcons.help, onPress: showHelp }],
  })

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

  return { editItem, select, isSelected, isEditing }
}
