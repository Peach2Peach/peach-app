import { PartiallySignedTransaction } from 'bdk-rn'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../../components/popup'
import { PopupComponent } from '../../../components/popup/PopupComponent'
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
      showLoadingPopup({ title: i18n('wallet.bumpNetworkFees.confirmRbf.title') })
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
      setPopup(
        <PopupComponent
          title={i18n('wallet.bumpNetworkFees.confirmRbf.title')}
          content={
            <ConfirmRbf
              oldFeeRate={currentFeeRate}
              newFeeRate={newFeeRate}
              bytes={transaction.size}
              sendingAmount={sendingAmount}
              hasNoChange={transaction.vout.length === 1}
            />
          }
          actions={
            <>
              <PopupAction label={i18n('cancel')} iconId="xCircle" onPress={closePopup} />
              <PopupAction
                label={i18n('fundFromPeachWallet.confirm.confirmAndSend')}
                iconId="arrowRightCircle"
                onPress={() => confirmAndSend(finishedTransaction, onSuccess)}
                reverseOrder
              />
            </>
          }
        />,
      )
    },
    [closePopup, confirmAndSend, setPopup],
  )

  return showConfirmRbfPopup
}
