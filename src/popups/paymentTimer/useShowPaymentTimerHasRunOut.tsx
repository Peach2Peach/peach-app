import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'
import { peachAPI } from '../../utils/peachAPI'
import { useConfirmCancelTrade } from '../tradeCancelation/useConfirmCancelTrade'
import { PaymentTimerHasRunOut } from './PaymentTimerHasRunOut'

export const useShowPaymentTimerHasRunOut = () => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const { cancelSeller } = useConfirmCancelTrade()
  const showError = useShowErrorBanner()

  const showPaymentTimerHasRunOut = useCallback(
    (contract: Contract, inTrade: boolean) => {
      const closeAction: Action = {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closePopup,
      }
      const goToContract: Action = {
        label: i18n('checkTrade'),
        icon: 'arrowLeftCircle',
        callback: () => {
          closePopup()
          navigation.navigate('contract', { contractId: contract.id })
        },
      }
      const cancelTrade: Action = {
        label: i18n('contract.seller.paymentTimerHasRunOut.cancelTrade'),
        icon: 'xSquare',
        callback: () => {
          cancelSeller(contract)
          closePopup()
        },
      }
      const extraTime: Action = {
        label: i18n('contract.seller.paymentTimerHasRunOut.extraTime'),
        icon: 'clock',
        callback: async () => {
          showLoadingPopup({
            title: i18n('contract.buyer.paymentTimerHasRunOut.title'),
            level: 'WARN',
          })

          const { result, error: err } = await peachAPI.private.contract.extendPaymentTimer({ contractId: contract.id })
          if (!result || err) showError(err?.error)

          closePopup()
        },
      }

      setPopup({
        title: i18n('contract.seller.paymentTimerHasRunOut.title'),
        content: <PaymentTimerHasRunOut {...{ contract }} />,
        visible: true,
        level: 'WARN',
        action1: inTrade ? extraTime : goToContract,
        action2: inTrade ? cancelTrade : closeAction,
      })
    },
    [cancelSeller, closePopup, navigation, showError, showLoadingPopup, setPopup],
  )

  return showPaymentTimerHasRunOut
}
