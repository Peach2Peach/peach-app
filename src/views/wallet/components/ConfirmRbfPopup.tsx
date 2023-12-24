import { PartiallySignedTransaction } from 'bdk-rn'
import { useCallback } from 'react'
import { PopupAction } from '../../../components/popup'
import { useClosePopup } from '../../../components/popup/Popup'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { LoadingPopupAction } from '../../../popups/actions/LoadingPopupAction'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmRbf } from './ConfirmRbf'

type Props = {
  currentFeeRate: number
  newFeeRate: number
  transaction: Transaction
  sendingAmount: number
  finishedTransaction: PartiallySignedTransaction
  onSuccess: (txId: string) => void
}

export function ConfirmRbfPopup ({
  currentFeeRate,
  newFeeRate,
  transaction,
  sendingAmount,
  finishedTransaction,
  onSuccess,
}: Props) {
  const closePopup = useClosePopup()
  const handleTransactionError = useHandleTransactionError()

  const confirmAndSend = useCallback(async () => {
    try {
      const [txId] = await Promise.all([
        finishedTransaction.txid(),
        peachWallet.signAndBroadcastPSBT(finishedTransaction),
      ])

      onSuccess(txId)
    } catch (e) {
      handleTransactionError(e)
    } finally {
      closePopup()
    }
  }, [closePopup, finishedTransaction, handleTransactionError, onSuccess])

  return (
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
          <LoadingPopupAction
            label={i18n('fundFromPeachWallet.confirm.confirmAndSend')}
            iconId="arrowRightCircle"
            onPress={confirmAndSend}
            reverseOrder
          />
        </>
      }
    />
  )
}
