import { useCallback } from 'react'
import { useNavigation } from '../../../hooks'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildBumpFeeTransaction } from '../../../utils/wallet/transaction'
import { useShowConfirmRbfPopup } from './useShowConfirmRbfPopup'

type Props = {
  transaction?: Transaction | null
  newFeeRate: number
  sendingAmount: number
}
export const useBumpFees = ({ transaction, newFeeRate, sendingAmount }: Props) => {
  const showConfirmRbfPopup = useShowConfirmRbfPopup()
  const handleTransactionError = useHandleTransactionError()

  const navigation = useNavigation()

  const onSuccess = useCallback(
    (newTxId: string) => {
      navigation.goBack()
      navigation.replace('transactionDetails', { txId: newTxId })
    },
    [navigation],
  )

  const bumpFees = useCallback(async () => {
    if (!transaction) return

    try {
      const bumpFeeTransaction = await buildBumpFeeTransaction(transaction.txid, Number(newFeeRate))
      const finishedTransaction = await peachWallet.finishTransaction(bumpFeeTransaction)

      showConfirmRbfPopup({
        currentFeeRate: getTransactionFeeRate(transaction),
        newFeeRate,
        transaction,
        sendingAmount,
        finishedTransaction,
        onSuccess,
      })
    } catch (e) {
      handleTransactionError(e)
    }
  }, [handleTransactionError, newFeeRate, onSuccess, sendingAmount, showConfirmRbfPopup, transaction])

  return bumpFees
}
