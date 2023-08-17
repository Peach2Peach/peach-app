import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useMemo, useState } from 'react'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useConfigStore } from '../../../store/configStore'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildTransaction } from '../../../utils/wallet/transaction'
import { useOpenAmountTooLowPopup } from './useOpenAmountTooLowPopup'
import { useShowFundEscrowPopup } from './useShowFundEscrowPopup'
import { useShowInsufficientFundsPopup } from './useShowInsufficientFundsPopup'

const canFundOfferFromPeachWallet = (fundingStatus: FundingStatus, offer?: SellOffer) =>
  offer?.escrow && fundingStatus.status === 'NULL'

type Props = {
  offer?: SellOffer
  fundingStatus: FundingStatus
}
export const useFundFromPeachWallet = ({ offer, fundingStatus }: Props) => {
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount)
  const showErrorBanner = useShowErrorBanner()
  const showFundEscrowPopup = useShowFundEscrowPopup()
  const showInsufficientFundsPopup = useShowInsufficientFundsPopup()
  const openAmountTooLowPopup = useOpenAmountTooLowPopup()

  const feeRate = useFeeRate()
  const canFundFromPeachWallet = useMemo(() => canFundOfferFromPeachWallet(fundingStatus, offer), [fundingStatus, offer])
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useState(false)

  const onSuccess = () => setFundedFromPeachWallet(true)

  const fundFromPeachWallet = async () => {
    if (!offer?.escrow || !canFundFromPeachWallet) return undefined

    if (peachWallet.balance < minTradingAmount) return openAmountTooLowPopup(peachWallet.balance, minTradingAmount)
    let finishedTransaction: TxBuilderResult
    try {
      const transaction = await buildTransaction({ address: offer.escrow, amount: offer.amount, feeRate })
      finishedTransaction = await peachWallet.finishTransaction(transaction)
    } catch (e) {
      const transactionError = parseError(Array.isArray(e) ? e[0] : e)
      if (transactionError !== 'INSUFFICIENT_FUNDS') return showErrorBanner(transactionError)
      const transaction = await buildTransaction({ address: offer.escrow, feeRate, shouldDrainWallet: true })
      finishedTransaction = await peachWallet.finishTransaction(transaction)
      return showInsufficientFundsPopup({
        address: offer.escrow,
        transaction: finishedTransaction,
        feeRate,
        onSuccess,
      })
    }
    return showFundEscrowPopup({
      address: offer.escrow,
      transaction: finishedTransaction,
      feeRate,
      onSuccess,
    })
  }

  return {
    canFundFromPeachWallet,
    fundFromPeachWallet,
    fundedFromPeachWallet,
  }
}
