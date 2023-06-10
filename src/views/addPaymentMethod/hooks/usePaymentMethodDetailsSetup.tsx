import { useCallback } from 'react'
import { HeaderConfig } from '../../../components/header/Header'
import { useDeletePaymentMethod } from '../../../components/payment/hooks/useDeletePaymentMethod'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { addPaymentData } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { headerIcons } from '../../../utils/layout/headerIcons'

export const usePaymentMethodDetailsSetup = () => {
  const route = useRoute<'paymentMethodDetails'>()
  const goToOrigin = useGoToOrigin()
  const { paymentData: data } = route.params
  const { type: paymentMethod, currencies } = data
  const deletePaymentMethod = useDeletePaymentMethod(data.id ?? '')

  const onSubmit = (d: PaymentData) => {
    addPaymentData(d)
    // todo: automatically select in offer preferences
    goToOrigin(route.params.origin)
  }

  const showHelp = useShowHelp('currencies')

  const getHeaderIcons = useCallback(() => {
    const icons: HeaderConfig['icons'] = []
    if (['revolut', 'wise', 'paypal', 'advcash'].includes(paymentMethod)) {
      icons[0] = { ...headerIcons.help, onPress: showHelp }
    }
    if (data.id) {
      icons[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    info('icons' + icons)
    return icons
  }, [data.id, deletePaymentMethod, paymentMethod, showHelp])

  useHeaderSetup({
    title: i18n(
      data.id ? 'paymentMethod.edit.title' : 'paymentMethod.select.title',
      i18n(`paymentMethod.${paymentMethod}`),
    ),
    icons: getHeaderIcons(),
  })

  return { paymentMethod, onSubmit, currencies, data }
}
