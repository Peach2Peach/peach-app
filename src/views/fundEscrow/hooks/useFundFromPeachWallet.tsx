import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleBroadcastError } from '../../../hooks/error/useHandleBroadcastError'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { useConfigStore } from '../../../store/configStore'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildDrainWalletTransaction } from '../../../utils/wallet/transaction'
import { buildTransaction } from '../../../utils/wallet/transaction/buildTransaction'
import { AmountTooLow } from '../components/AmountTooLow'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { ConfirmFundingWithInsufficientFunds } from '../components/ConfirmFundingWithInsufficientFunds'

type ShowConfirmTxPopupProps = {
  title: string
  content: JSX.Element
  transaction: TxBuilderResult
}
const canFundOfferFromPeachWallet = (fundingStatus: FundingStatus, offer?: SellOffer) =>
  offer?.escrow && fundingStatus.status === 'NULL'

type Props = {
  offer?: SellOffer
  fundingStatus: FundingStatus
}
export const useFundFromPeachWallet = ({ offer, fundingStatus }: Props) => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount)
  const showLoadingPopup = useShowLoadingPopup()
  const handleBroadcastError = useHandleBroadcastError()
  const showErrorBanner = useShowErrorBanner()
  const feeRate = useFeeRate()
  const [canFundFromPeachWallet, setCanFundFromPeachWallet] = useState(canFundOfferFromPeachWallet(fundingStatus, offer))
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useState(false)

  const confirmAndSend = async (transaction: TxBuilderResult) => {
    showLoadingPopup({
      title: i18n('fundFromPeachWallet.confirm.title'),
      level: 'APP',
    })
    try {
      await peachWallet.signAndBroadcastTransaction(transaction)
      setFundedFromPeachWallet(true)
    } catch (e) {
      handleBroadcastError(e)
    } finally {
      closePopup()
    }
  }

  const showConfirmTxPopup = ({ title, content, transaction }: ShowConfirmTxPopupProps) => {
    setPopup({
      title,
      level: 'APP',
      content,
      action1: {
        label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
        icon: 'arrowRightCircle',
        callback: () => confirmAndSend(transaction),
      },
      action2: {
        label: i18n('cancel'),
        icon: 'xCircle',
        callback: closePopup,
      },
    })
  }

  const showFundEscrowPopup = async (escrow: string, finishedTransaction: TxBuilderResult) => {
    const fee = await finishedTransaction.psbt.feeAmount()

    showConfirmTxPopup({
      title: i18n('fundFromPeachWallet.confirm.title'),
      content: (
        <ConfirmFundingFromPeachWallet
          amount={finishedTransaction.txDetails.sent}
          address={escrow}
          fee={fee}
          feeRate={feeRate}
        />
      ),
      transaction: finishedTransaction,
    })
  }

  const showInsufficientFundsPopup = async (escrow: string, finishedTransaction: TxBuilderResult) => {
    const fee = await finishedTransaction.psbt.feeAmount()

    showConfirmTxPopup({
      title: i18n('fundFromPeachWallet.insufficientFunds.title'),
      content: (
        <ConfirmFundingWithInsufficientFunds
          amount={finishedTransaction.txDetails.sent}
          address={escrow}
          fee={fee}
          feeRate={feeRate}
        />
      ),
      transaction: finishedTransaction,
    })
  }

  const openAmountTooLowPopup = (available: number, needed: number) => {
    setPopup({
      title: i18n('fundFromPeachWallet.amountTooLow.title'),
      level: 'APP',
      content: <AmountTooLow {...{ available, needed }} />,
    })
  }

  const fundFromPeachWallet = async (): Promise<void> => {
    if (!offer?.escrow || !canFundFromPeachWallet) return undefined

    if (peachWallet.balance < minTradingAmount) return openAmountTooLowPopup(peachWallet.balance, minTradingAmount)
    let finishedTransaction: TxBuilderResult
    try {
      const transaction = await buildTransaction(offer.escrow, offer.amount, feeRate)
      finishedTransaction = await peachWallet.finishTransaction(transaction)
    } catch (e) {
      const broadcastError = parseError(e)
      if (!broadcastError.includes('InsufficientFunds')) return showErrorBanner(broadcastError)

      const transaction = await buildDrainWalletTransaction(offer.escrow, feeRate)
      finishedTransaction = await peachWallet.finishTransaction(transaction)
      return showInsufficientFundsPopup(offer.escrow, finishedTransaction)
    }
    return showFundEscrowPopup(offer.escrow, finishedTransaction)
  }

  useEffect(() => {
    setCanFundFromPeachWallet(canFundOfferFromPeachWallet(fundingStatus, offer))
  }, [fundingStatus, offer])

  return { canFundFromPeachWallet, fundFromPeachWallet, fundedFromPeachWallet }
}
