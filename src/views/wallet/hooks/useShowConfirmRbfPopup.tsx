import { PartiallySignedTransaction } from 'bdk-rn'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmRbf } from '../components/ConfirmRbf'

type Props = {
  currentFeeRate: number
  newFeeRate: number
  transaction: Transaction
  sendingAmount: number
  finishedTransaction: PartiallySignedTransaction
  onSuccess: (txId: string) => void
}

export const useShowConfirmRbfPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const handleTransactionError = useHandleTransactionError()

  const confirmAndSend = useCallback(
    async (rbfTransaction: PartiallySignedTransaction, onSuccess: Props['onSuccess']) => {
      showLoadingPopup({
        title: i18n('wallet.bumpNetworkFees.confirmRbf.title'),
        level: 'APP',
      })
      try {
        const [txId] = await Promise.all([rbfTransaction.txid(), peachWallet.signAndBroadcastPSBT(rbfTransaction)])

        onSuccess(txId)
      } catch (e) {
        handleTransactionError(e)
      } finally {
        closePopup()
      }
    },
    [closePopup, handleTransactionError, showLoadingPopup],
  )

  const showConfirmRbfPopup = useCallback(
    ({ currentFeeRate, newFeeRate, transaction, sendingAmount, finishedTransaction, onSuccess }: Props) => {
      setPopup({
        title: i18n('wallet.bumpNetworkFees.confirmRbf.title'),
        level: 'APP',
        content: (
          <ConfirmRbf
            oldFeeRate={currentFeeRate}
            newFeeRate={newFeeRate}
            bytes={transaction.size}
            sendingAmount={sendingAmount}
            hasNoChange={transaction.vout.length === 1}
          />
        ),
        action1: {
          label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
          icon: 'arrowRightCircle',
          callback: () => confirmAndSend(finishedTransaction, onSuccess),
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

  return showConfirmRbfPopup
}
