import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleBroadcastError } from '../../../hooks/error/useHandleBroadcastError'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/result'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildDrainWalletTransaction } from '../../../utils/wallet/transaction'
import { buildTransaction } from '../../../utils/wallet/transaction/buildTransaction'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { ConfirmFundingWithInsufficientFunds } from '../components/ConfirmFundingWithInsufficientFunds'
import { useConfigStore } from '../../../store/configStore'
import { AmountTooLow } from '../components/AmountTooLow'

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
  const feeRate = useFeeRate()
  const [canFundFromPeachWallet, setCanFundFromPeachWallet] = useState(canFundOfferFromPeachWallet(fundingStatus, offer))
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useState(false)

  const confirmAndSend = async (transaction: TxBuilderResult) => {
    if (!offer?.escrow || !canFundFromPeachWallet) throw Error()

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

  const showFundEscrowPopup = async (finishedTransaction: TxBuilderResult) => {
    if (!offer?.escrow || !canFundFromPeachWallet) throw Error()

    const fee = await finishedTransaction.psbt.feeAmount()

    setPopup({
      title: i18n('fundFromPeachWallet.confirm.title'),
      level: 'APP',
      content: (
        <ConfirmFundingFromPeachWallet
          amount={finishedTransaction.txDetails.sent}
          address={offer.escrow}
          fee={fee}
          feeRate={feeRate}
        />
      ),
      action1: {
        label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
        icon: 'arrowRightCircle',
        callback: () => confirmAndSend(finishedTransaction),
      },
      action2: {
        label: i18n('cancel'),
        icon: 'xCircle',
        callback: closePopup,
      },
    })
  }
  const showInsufficientFundsPopup = async (finishedTransaction: TxBuilderResult) => {
    if (!offer?.escrow || !canFundFromPeachWallet) throw Error()

    const fee = await finishedTransaction.psbt.feeAmount()

    setPopup({
      title: i18n('fundFromPeachWallet.insufficientFunds.title'),
      level: 'APP',
      content: (
        <ConfirmFundingWithInsufficientFunds
          amount={finishedTransaction.txDetails.sent}
          address={offer.escrow}
          fee={fee}
          feeRate={feeRate}
        />
      ),
      action1: {
        label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
        icon: 'arrowRightCircle',
        callback: () => confirmAndSend(finishedTransaction),
      },
      action2: {
        label: i18n('cancel'),
        icon: 'xCircle',
        callback: closePopup,
      },
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
      if (!broadcastError.includes('InsufficientFunds')) return handleBroadcastError(e)

      const transaction = await buildDrainWalletTransaction(offer.escrow, feeRate)
      finishedTransaction = await peachWallet.finishTransaction(transaction)
      return showInsufficientFundsPopup(finishedTransaction)
    }
    return showFundEscrowPopup(finishedTransaction)
  }

  useEffect(() => {
    setCanFundFromPeachWallet(canFundOfferFromPeachWallet(fundingStatus, offer))
  }, [fundingStatus, offer])

  return { canFundFromPeachWallet, fundFromPeachWallet, fundedFromPeachWallet }
}
