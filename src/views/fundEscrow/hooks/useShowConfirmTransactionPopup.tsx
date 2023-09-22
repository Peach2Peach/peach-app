import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

type Props = {
  title: string
  content: JSX.Element
  transaction: TxBuilderResult
  onSuccess: (tx: TxBuilderResult) => void
}

export const useShowConfirmTransactionPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const handleTransactionError = useHandleTransactionError()

  const confirmAndSend = useCallback(
    async (transaction: TxBuilderResult, onSuccess: Props['onSuccess']) => {
      showLoadingPopup({
        title: i18n('fundFromPeachWallet.confirm.title'),
        level: 'APP',
      })
      try {
        await peachWallet.signAndBroadcastPSBT(transaction.psbt)
        onSuccess(transaction)
      } catch (e) {
        handleTransactionError(e)
      } finally {
        closePopup()
      }
    },
    [closePopup, handleTransactionError, showLoadingPopup],
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
