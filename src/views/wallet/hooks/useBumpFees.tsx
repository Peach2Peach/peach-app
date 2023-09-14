import { useCallback } from 'react'
import { useNavigation } from '../../../hooks'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildBumpFeeTransaction } from '../../../utils/wallet/transaction'
import { useShowConfirmRbfPopup } from './useShowConfirmRbfPopup'
import { useSyncWallet } from './useSyncWallet'

const useRemoveTxFromPeachWallet = () => {
  const [removeTransaction, removePendingTransaction] = useWalletState(
    (state) => [state.removeTransaction, state.removePendingTransaction],
    shallow,
  )

  const removeTxFromPeachWallet = useCallback(
    (transaction: Transaction) => {
      if (!transaction) return
      removeTransaction(transaction.txid)
      removePendingTransaction(transaction.txid)
      peachWallet.transactions = peachWallet.transactions.filter((tx) => tx.txid !== transaction.txid)
    },
    [removePendingTransaction, removeTransaction],
  )

  return removeTxFromPeachWallet
}

type Props = {
  transaction?: Transaction | null
  newFeeRate: number
  sendingAmount: number
}
export const useBumpFees = ({ transaction, newFeeRate, sendingAmount }: Props) => {
  const showConfirmRbfPopup = useShowConfirmRbfPopup()
  const handleTransactionError = useHandleTransactionError()
  const { refresh } = useSyncWallet()
  const removeTxFromPeachWallet = useRemoveTxFromPeachWallet()
  const navigation = useNavigation()

  const onSuccess = useCallback(
    (newTxId: string) => {
      navigation.goBack()
      if (transaction) removeTxFromPeachWallet(transaction)
      refresh()
      navigation.replace('transactionDetails', { txId: newTxId })
    },
    [navigation, refresh, removeTxFromPeachWallet, transaction],
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
