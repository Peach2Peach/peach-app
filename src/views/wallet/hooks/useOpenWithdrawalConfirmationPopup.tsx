import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'

type Props = {
  address: string
  transaction: TxBuilderResult
  feeRate: number
  onSuccess: (txId: string) => void
}

export const useOpenWithdrawalConfirmationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const handleTransactionError = useHandleTransactionError()
  const showLoadingPopup = useShowLoadingPopup()

  const confirmWithdrawal = useCallback(
    async (transaction: TxBuilderResult, onSuccess: Props['onSuccess']) => {
      showLoadingPopup({
        title: i18n('wallet.confirmWithdraw.title'),
        level: 'APP',
      })
      try {
        const result = await peachWallet.signAndBroadcastPSBT(transaction.psbt)
        onSuccess(await result.txid())
      } catch (e) {
        handleTransactionError(e)
      } finally {
        closePopup()
      }
    },
    [closePopup, handleTransactionError, showLoadingPopup],
  )

  const openWithdrawalConfirmationPopup = useCallback(
    async ({ address, transaction, feeRate, onSuccess }: Props) => {
      const amount = transaction.txDetails.sent - transaction.txDetails.received
      const fee = await transaction.psbt.feeAmount()

      setPopup({
        title: i18n('wallet.confirmWithdraw.title'),
        content: <WithdrawalConfirmation {...{ amount, address, fee, feeRate }} />,
        action2: {
          callback: closePopup,
          label: i18n('cancel'),
          icon: 'xCircle',
        },
        action1: {
          callback: () => confirmWithdrawal(transaction, onSuccess),
          label: i18n('wallet.confirmWithdraw.confirm'),
          icon: 'arrowRightCircle',
        },
        level: 'APP',
      })
    },
    [closePopup, confirmWithdrawal, setPopup],
  )
  return openWithdrawalConfirmationPopup
}
