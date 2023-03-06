import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { PaymentTimerSellerCanceled } from './PaymentTimerSellerCanceled'

export const useShowPaymentTimerSellerCanceled = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const showPaymentTimerSellerCanceled = useCallback(
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
        title: i18n('contract.buyer.paymentTimerSellerCanceled.title'),
        content: <PaymentTimerSellerCanceled contract={contract} />,
        visible: true,
        level: 'APP',
        action1,
        action2,
      })
    },
    [closeOverlay, navigation, updateOverlay],
  )

  return showPaymentTimerSellerCanceled
}
