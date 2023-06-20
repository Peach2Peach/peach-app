import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useEffect, useState } from 'react'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useConfigStore } from '../../../store/configStore'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildDrainWalletTransaction, buildTransaction } from '../../../utils/wallet/transaction'
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
  const [canFundFromPeachWallet, setCanFundFromPeachWallet] = useState(canFundOfferFromPeachWallet(fundingStatus, offer))
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useState(false)

  const onSuccess = () => setFundedFromPeachWallet(true)

  const fundFromPeachWallet = async () => {
    if (!offer?.escrow || !canFundFromPeachWallet) return undefined

    if (peachWallet.balance < minTradingAmount) return openAmountTooLowPopup(peachWallet.balance, minTradingAmount)
    let finishedTransaction: TxBuilderResult
    try {
      const transaction = await buildTransaction(offer.escrow, offer.amount, feeRate)
      finishedTransaction = await peachWallet.finishTransaction(transaction)
    } catch (e) {
      const transactionError = parseError(e)
      if (!transactionError.includes('InsufficientFunds')) return showErrorBanner(transactionError)

      const transaction = await buildDrainWalletTransaction(offer.escrow, feeRate)
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

  useEffect(() => {
    setCanFundFromPeachWallet(canFundOfferFromPeachWallet(fundingStatus, offer))
  }, [fundingStatus, offer])

  return { canFundFromPeachWallet, fundFromPeachWallet, fundedFromPeachWallet }
}
