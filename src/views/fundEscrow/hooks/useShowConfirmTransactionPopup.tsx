import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { useHandleBroadcastError } from '../../../hooks/error/useHandleBroadcastError'
import { peachWallet } from '../../../utils/wallet/setWallet'

type Props = {
  title: string
  content: JSX.Element
  transaction: TxBuilderResult
  onSuccess: Function
}

export const useShowConfirmTransactionPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const handleBroadcastError = useHandleBroadcastError()

  const confirmAndSend = useCallback(
    async (transaction: TxBuilderResult, onSuccess: Function) => {
      showLoadingPopup({
        title: i18n('fundFromPeachWallet.confirm.title'),
        level: 'APP',
      })
      try {
        await peachWallet.signAndBroadcastPSBT(transaction.psbt)
        onSuccess()
      } catch (e) {
        handleBroadcastError(e)
      } finally {
        closePopup()
      }
    },
    [closePopup, handleBroadcastError, showLoadingPopup],
  )

  const showConfirmTransactionPopup = useCallback(
    ({ title, content, transaction, onSuccess }: Props) => {
      setPopup({
        title,
        level: 'APP',
        content,
        action1: {
          label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
          icon: 'arrowRightCircle',
          callback: () => confirmAndSend(transaction, onSuccess),
        },
        action2: {
          label: i18n('cancel'),
          icon: 'xCircle',
          callback: closePopup,
        },
      })
    },
    [closePopup, confirmAndSend, setPopup],
  )
  return showConfirmTransactionPopup
}
