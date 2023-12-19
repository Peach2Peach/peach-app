import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useNavigation } from '../../../hooks/useNavigation'
import { getTransactionFeeRate } from '../../../utils/bitcoin/getTransactionFeeRate'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildBumpFeeTransaction } from '../../../utils/wallet/transaction/buildBumpFeeTransaction'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useShowConfirmRbfPopup } from './useShowConfirmRbfPopup'

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
  const removeTxFromPeachWallet = useRemoveTxFromPeachWallet()
  const navigation = useNavigation()

  const onSuccess = useCallback(
    (newTxId: string) => {
      navigation.goBack()
      if (transaction) removeTxFromPeachWallet(transaction)
      navigation.replace('transactionDetails', { txId: newTxId })
    },
    [navigation, removeTxFromPeachWallet, transaction],
  )

  const bumpFees = useCallback(async () => {
    if (!transaction) return

    try {
      const bumpFeeTransaction = await buildBumpFeeTransaction(
        transaction.txid,
        Number(newFeeRate),
        transaction.vout.length === 1 ? transaction.vout[0].scriptpubkey_address : undefined,
      )
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
