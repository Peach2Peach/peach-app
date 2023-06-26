import { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useRoute, useShowHelp } from '../../../hooks'
import { useHandleTransactionError } from '../../../hooks/error/useHandleTransactionError'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout'
import { getErrorsInField } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildBumpFeeTransaction } from '../../../utils/wallet/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useShowConfirmRbfPopup } from './useShowConfirmRbfPopup'

export const useBumpNetworkFeesSetup = () => {
  const { txId } = useRoute<'bumpNetworkFees'>().params
  const showConfirmRbfPopup = useShowConfirmRbfPopup()
  const handleTransactionError = useHandleTransactionError()

  const navigation = useNavigation()
  const showHelp = useShowHelp('rbf')
  const [localTransaction, removePendingTransaction] = useWalletState(
    (state) => [state.getTransaction(txId), state.removePendingTransaction],
    shallow,
  )
  const { transaction } = useTransactionDetails({ txId })
  const { estimatedFees } = useFeeEstimate()
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const [newFeeRate, setNewFeeRate] = useState(String(currentFeeRate))
  const newFeeRateRules = useMemo(() => ({ min: currentFeeRate + 1, required: true, feeRate: true }), [currentFeeRate])
  const newFeeRateErrors = useMemo(() => getErrorsInField(newFeeRate, newFeeRateRules), [newFeeRate, newFeeRateRules])
  const newFeeRateIsValid = newFeeRate && newFeeRateErrors.length === 0
  const overpayingBy = Number(newFeeRate) / estimatedFees.fastestFee - 1

  useHeaderSetup({
    title: i18n('wallet.bumpNetworkFees.title'),
    icons: [{ ...headerIcons.help, onPress: showHelp }],
  })

  const onSuccess = (newTxId: string) => {
    removePendingTransaction(txId)
    navigation.goBack()
    navigation.replace('transactionDetails', { txId: newTxId })
  }

  const bumpFees = async () => {
    if (!transaction || !newFeeRateIsValid || !localTransaction) return
    try {
      const bumpFeeTransaction = await buildBumpFeeTransaction(txId, Number(newFeeRate))
      const finishedTransaction = await peachWallet.finishTransaction(bumpFeeTransaction)

      showConfirmRbfPopup({
        currentFeeRate,
        newFeeRate,
        transaction,
        localTransaction,
        finishedTransaction,
        onSuccess,
      })
    } catch (e) {
      handleTransactionError(e)
    }
  }

  useEffect(() => {
    setNewFeeRate(String(currentFeeRate + 1))
  }, [currentFeeRate])

  return {
    transaction,
    currentFeeRate,
    newFeeRate,
    setNewFeeRate,
    newFeeRateIsValid,
    newFeeRateErrors,
    estimatedFees,
    overpayingBy,
    bumpFees,
  }
}
