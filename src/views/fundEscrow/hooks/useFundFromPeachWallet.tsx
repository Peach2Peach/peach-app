import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useConfigStore } from '../../../store/configStore'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildTransaction, setMultipleRecipients } from '../../../utils/wallet/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useOpenAmountTooLowPopup } from './useOpenAmountTooLowPopup'
import { useShowFundEscrowPopup } from './useShowFundEscrowPopup'
import { useShowInsufficientFundsPopup } from './useShowInsufficientFundsPopup'

const canFundOfferFromPeachWallet = (fundingStatus: FundingStatus, address?: string) =>
  !!address && fundingStatus.status === 'NULL'

type Props = {
  address?: string
  addresses?: string[]
  amount?: number
  fundingStatus: FundingStatus
}
export const useFundFromPeachWallet = ({ address, addresses = [], amount, fundingStatus }: Props) => {
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount)
  const showErrorBanner = useShowErrorBanner()
  const showFundEscrowPopup = useShowFundEscrowPopup()
  const showInsufficientFundsPopup = useShowInsufficientFundsPopup()
  const openAmountTooLowPopup = useOpenAmountTooLowPopup()

  const feeRate = useFeeRate()
  const canFundFromPeachWallet = useMemo(
    () => canFundOfferFromPeachWallet(fundingStatus, address),
    [fundingStatus, address],
  )
  const [fundedFromPeachWallet, setFundedFromPeachWallet, unregisterFundMultiple] = useWalletState(
    (state) => [
      address ? state.isFundedFromPeachWallet(address) : false,
      state.setFundedFromPeachWallet,
      state.unregisterFundMultiple,
    ],
    shallow,
  )

  const onSuccess = () => {
    if (address) {
      unregisterFundMultiple(address)
      setFundedFromPeachWallet(address)
      addresses.forEach(setFundedFromPeachWallet)
    }
  }

  const fundFromPeachWallet = async () => {
    if (!address || !amount || !canFundFromPeachWallet) return undefined
    if (peachWallet.balance < (addresses.length || 1) * minTradingAmount) {
      return openAmountTooLowPopup(peachWallet.balance, (addresses.length || 1) * minTradingAmount)
    }

    let finishedTransaction: TxBuilderResult
    try {
      const transaction = await buildTransaction({ feeRate })
      if (addresses.length > 0) await setMultipleRecipients(transaction, amount, addresses)

      finishedTransaction = await peachWallet.finishTransaction(transaction)
    } catch (e) {
      const transactionError = parseError(Array.isArray(e) ? e[0] : e)
      if (transactionError !== 'INSUFFICIENT_FUNDS') return showErrorBanner(transactionError)

      if (addresses.length > 1) {
        const { available } = Array.isArray(e) ? e[1] : { available: 0 }
        return showErrorBanner('INSUFFICIENT_FUNDS', [amount, available])
      }

      const transaction = await buildTransaction({ address, feeRate, shouldDrainWallet: true })
      finishedTransaction = await peachWallet.finishTransaction(transaction)
      return showInsufficientFundsPopup({
        address,
        transaction: finishedTransaction,
        feeRate,
        onSuccess,
      })
    }
    return showFundEscrowPopup({
      address,
      transaction: finishedTransaction,
      feeRate,
      onSuccess,
    })
  }

  return { canFundFromPeachWallet, fundFromPeachWallet, fundedFromPeachWallet }
}
