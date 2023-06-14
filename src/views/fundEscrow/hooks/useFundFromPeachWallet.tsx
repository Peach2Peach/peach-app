import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHandleBroadcastError } from '../../../hooks/error/useHandleBroadcastError'
import { useFeeRate } from '../../../hooks/useFeeRate'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { buildTransaction } from '../../../utils/wallet/transaction/buildTransaction'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'

const canFundOfferFromPeachWallet = (fundingStatus: FundingStatus, offer?: SellOffer) =>
  offer?.escrow && fundingStatus.status === 'NULL'

type Props = {
  offer?: SellOffer
  fundingStatus: FundingStatus
}
export const useFundFromPeachWallet = ({ offer, fundingStatus }: Props) => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const handleBroadcastError = useHandleBroadcastError()
  const feeRate = useFeeRate()
  const [canFundFromPeachWallet, setCanFundFromPeachWallet] = useState(canFundOfferFromPeachWallet(fundingStatus, offer))
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useState(false)

  const confirmAndSend = async (transaction: TxBuilderResult) => {
    if (!offer?.escrow || !canFundFromPeachWallet) throw Error('WALLET_NOT_READY')

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

  const fundFromPeachWallet = async () => {
    if (!offer?.escrow || !canFundFromPeachWallet) return
    const transaction = await buildTransaction(offer.escrow, offer.amount, feeRate)
    const finishedTransaction = await peachWallet.finishTransaction(transaction)
    const fee = await finishedTransaction.psbt.feeAmount()
    setPopup({
      title: i18n('fundFromPeachWallet.confirm.title'),
      level: 'APP',
      content: (
        <ConfirmFundingFromPeachWallet amount={offer.amount} address={offer.escrow} fee={fee} feeRate={feeRate} />
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

  useEffect(() => {
    setCanFundFromPeachWallet(canFundOfferFromPeachWallet(fundingStatus, offer))
  }, [fundingStatus, offer])

  return { canFundFromPeachWallet, fundFromPeachWallet, fundedFromPeachWallet }
}
