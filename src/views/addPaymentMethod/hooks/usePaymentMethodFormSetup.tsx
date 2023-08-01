import { useCallback } from 'react'
import { HeaderConfig } from '../../../components/header/Header'
import { useDeletePaymentMethod } from '../../../components/payment/hooks/useDeletePaymentMethod'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'

export const usePaymentMethodFormSetup = () => {
  const route = useRoute<'paymentMethodForm'>()
  const goBackTo = useGoToOrigin()
  const { paymentData, origin } = route.params
  const { type: paymentMethod, id } = paymentData
  const deletePaymentMethod = useDeletePaymentMethod(id ?? '')
  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)
  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const onSubmit = (data: PaymentData) => {
    addPaymentData(data)
    selectPaymentMethod(data.id)
    goBackTo(origin)
  }

  const showHelp = useShowHelp('currencies')
  const showLNURLHelp = useShowHelp('lnurl')

  const getHeaderIcons = useCallback(() => {
    const icons: HeaderConfig['icons'] = []
    if (['revolut', 'wise', 'paypal', 'advcash'].includes(paymentMethod)) {
      icons[0] = { ...headerIcons.help, onPress: showHelp }
    }
    if (['lnurl'].includes(paymentMethod)) {
      icons[0] = { ...headerIcons.help, onPress: showLNURLHelp }
    }
    if (id) {
      icons[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    return icons
  }, [id, deletePaymentMethod, paymentMethod, showHelp])

  useHeaderSetup({
    title: i18n(id ? 'paymentMethod.edit.title' : 'paymentMethod.select.title', i18n(`paymentMethod.${paymentMethod}`)),
    icons: getHeaderIcons(),
  })

  return { onSubmit, data: paymentData }
}
