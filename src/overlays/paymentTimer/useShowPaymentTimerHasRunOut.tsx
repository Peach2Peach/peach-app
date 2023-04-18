import { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useShowLoadingOverlay } from '../../hooks/useShowLoadingOverlay'
import i18n from '../../utils/i18n'
import { extendPaymentTimer } from '../../utils/peachAPI'
import { useConfirmCancelTrade } from '../tradeCancelation/useConfirmCancelTrade'
import { PaymentTimerHasRunOut } from './PaymentTimerHasRunOut'

export const useShowPaymentTimerHasRunOut = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()
  const { cancelSeller } = useConfirmCancelTrade()
  const showError = useShowErrorBanner()

  const showLoadingOverlay = useShowLoadingOverlay()
  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const showPaymentTimerHasRunOutForSeller = useCallback(
    (contract: Contract, inTrade: boolean) => {
      const closeAction: Action = {
        label: i18n('close'),
        icon: 'xSquare',
        callback: () => closeOverlay(),
      }
      const goToContract: Action = {
        label: i18n('checkTrade'),
        icon: 'arrowLeftCircle',
        callback: () => {
          closeOverlay()
          navigation.navigate('contract', { contractId: contract.id })
        },
      }
      const cancelTrade: Action = {
        label: i18n('contract.seller.paymentTimerHasRunOut.cancelTrade'),
        icon: 'xSquare',
        callback: () => cancelSeller(contract),
      }
      const extraTime: Action = {
        label: i18n('contract.seller.paymentTimerHasRunOut.extraTime'),
        icon: 'clock',
        callback: async () => {
          showLoadingOverlay({
            title: i18n('contract.buyer.paymentTimerHasRunOut.title'),
            level: 'WARN',
          })

          const [result, err] = await extendPaymentTimer({ contractId: contract.id })
          if (!result || err) showError(err?.error)

          closeOverlay()
        },
      }

      updateOverlay({
        title: i18n('contract.seller.paymentTimerHasRunOut.title'),
        content: <PaymentTimerHasRunOut {...{ contract }} />,
        visible: true,
        level: 'WARN',
        action1: inTrade ? extraTime : goToContract,
        action2: inTrade ? cancelTrade : closeAction,
      })
    },
    [cancelSeller, closeOverlay, navigation, showError, showLoadingOverlay, updateOverlay],
  )

  const showPaymentTimerHasRunOut = useCallback(
    (contract: Contract, inTrade: boolean) => showPaymentTimerHasRunOutForSeller(contract, inTrade),
    [showPaymentTimerHasRunOutForSeller],
  )

  return showPaymentTimerHasRunOut
}
