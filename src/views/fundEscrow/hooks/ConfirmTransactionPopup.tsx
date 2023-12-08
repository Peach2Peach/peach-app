import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import { PopupAction } from '../../../components/popup'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { LoadingPopupAction } from '../../../popups/actions/LoadingPopupAction'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'

type Props = {
  title: string
  content: JSX.Element
  transaction: TxBuilderResult
  onSuccess: (tx: TxBuilderResult) => void
}

export function ConfirmTransactionPopup ({ title, content, transaction, onSuccess }: Props) {
  const closePopup = usePopupStore((state) => state.closePopup)
  const handleTransactionError = useHandleTransactionError()
  const confirmAndSend = useCallback(async () => {
    try {
      await peachWallet.signAndBroadcastPSBT(transaction.psbt)
      // TODO: wtf is this?
      onSuccess(transaction)
    } catch (e) {
      handleTransactionError(e)
    } finally {
      closePopup()
    }
  }, [closePopup, handleTransactionError, onSuccess, transaction])

  return (
    <PopupComponent
      title={title}
      content={content}
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
