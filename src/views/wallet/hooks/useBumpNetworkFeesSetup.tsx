import { useMemo, useState } from 'react'
import { useRoute } from '../../../hooks'
import { useFeeEstimate } from '../../../hooks/query/useFeeEstimate'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import { getErrorsInField } from '../../../utils/validation'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const useBumpNetworkFeesSetup = () => {
  const { txId } = useRoute<'bumpNetworkFees'>().params

  const localTransaction = useWalletState((state) => state.getTransaction(txId))
  const { transaction } = useTransactionDetails({ txId })
  const { estimatedFees } = useFeeEstimate()
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const [newFeeRate, setNewFeeRate] = useState<string>()
  const feeRate = newFeeRate ?? (currentFeeRate + 1.01).toFixed(2)

  const newFeeRateRules = useMemo(() => ({ min: currentFeeRate + 1, required: true, feeRate: true }), [currentFeeRate])
  const newFeeRateErrors = useMemo(() => getErrorsInField(feeRate, newFeeRateRules), [feeRate, newFeeRateRules])
  const newFeeRateIsValid = feeRate && newFeeRateErrors.length === 0
  const overpayingBy = Number(feeRate) / estimatedFees.fastestFee - 1

  return {
    transaction,
    currentFeeRate,
    newFeeRate: feeRate,
    setNewFeeRate,
    newFeeRateIsValid,
    newFeeRateErrors,
    estimatedFees,
    sendingAmount: localTransaction ? localTransaction.sent - localTransaction.received : 0,
    overpayingBy,
  }
}
