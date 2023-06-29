import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildDrainWalletTransaction } from '../../../utils/wallet/transaction'
import { useOpenWithdrawalConfirmationPopup } from './useOpenWithdrawalConfirmationPopup'

type Props = {
  address: string
  onSuccess: (txId: string) => void
}
export const useSendAllTo = ({ address, onSuccess }: Props) => {
  const openWithdrawalConfirmationPopup = useOpenWithdrawalConfirmationPopup()
  const feeRate = useFeeRate()
  const handleTransactionError = useHandleTransactionError()

  const openWithdrawalConfirmation = async () => {
    try {
      const transaction = await buildDrainWalletTransaction(address, feeRate)
      const finishedTransaction = await peachWallet.finishTransaction(transaction)
      openWithdrawalConfirmationPopup({
        address,
        transaction: finishedTransaction,
        feeRate,
        onSuccess,
      })
    } catch (e) {
      handleTransactionError(e)
    }
  }

  return openWithdrawalConfirmation
}
