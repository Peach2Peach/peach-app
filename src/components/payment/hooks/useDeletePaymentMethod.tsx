import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { usePopupStore } from '../../../store/usePopupStore'
import { removePaymentData } from '../../../utils/account/removePaymentData'
import i18n from '../../../utils/i18n'

export const useDeletePaymentMethod = (id: string) => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const deleteMethod = useCallback(() => {
    setPopup({
      title: i18n('help.paymentMethodDelete.title'),
      content: <DeletePaymentMethodConfirm />,
      visible: true,
      level: 'ERROR',
      action1: {
        callback: closePopup,
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: () => {
          removePaymentData(id)
          navigation.goBack()
          closePopup()
        },
        icon: 'trash',
        label: i18n('delete'),
      },
    })
  }, [closePopup, id, navigation, setPopup])

  return deleteMethod
}
