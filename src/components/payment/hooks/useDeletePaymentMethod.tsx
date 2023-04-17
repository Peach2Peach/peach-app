import { useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { DeletePaymentMethodConfirm } from '../../../overlays/info/DeletePaymentMethodConfirm'
import { removePaymentData } from '../../../utils/account'
import i18n from '../../../utils/i18n'

export const useDeletePaymentMethod = (id: string) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const deleteMethod = () => {
    updateOverlay({
      title: i18n('help.paymentMethodDelete.title'),
      content: <DeletePaymentMethodConfirm />,
      visible: true,
      level: 'ERROR',
      action1: {
        callback: () => updateOverlay({ visible: false }),
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: () => {
          removePaymentData(id)
          updateOverlay({ visible: false })
          navigation.goBack()
        },
        icon: 'trash',
        label: i18n('delete'),
      },
    })
  }

  return deleteMethod
}
