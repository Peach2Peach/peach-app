import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { PaymentReminder } from './PaymentReminder'

export const useShowPaymentReminder = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const showPaymentReminder = useCallback(
    (contract: Contract, inTrade: boolean) => {
      const closeAction: Action = {
        label: i18n('close'),
        icon: 'xSquare',
        callback: () => closeOverlay(),
      }
      const action1 = inTrade
        ? closeAction
        : {
          label: i18n('checkTrade'),
          icon: 'arrowLeftCircle',
          callback: () => {
            closeOverlay()
            navigation.navigate('contract', { contractId: contract.id })
          },
        }
      const action2 = inTrade ? undefined : closeAction

      updateOverlay({
        title: i18n('contract.buyer.paymentReminder.title'),
        content: <PaymentReminder contract={contract} />,
        visible: true,
        level: 'APP',
        action1,
        action2,
      })
    },
    [closeOverlay, navigation, updateOverlay],
  )

  return showPaymentReminder
}
