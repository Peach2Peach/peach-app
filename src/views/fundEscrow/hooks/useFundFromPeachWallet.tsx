import { useEffect, useState } from 'react'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { usePopupStore } from '../../../store/usePopupStore'
import { shallow } from 'zustand/shallow'
import i18n from '../../../utils/i18n'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'

const canFundOfferFromPeachWallet = (wallet: PeachWallet, fundingStatus: FundingStatus, offer?: SellOffer) =>
  !!offer && wallet.balance >= offer.amount && fundingStatus.status === 'NULL'

type Props = {
  offer?: SellOffer
  fundingStatus: FundingStatus
}
export const useFundFromPeachWallet = ({ offer, fundingStatus }: Props) => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const [canFundFromPeachWallet, setCanFundFromPeachWallet] = useState(
    canFundOfferFromPeachWallet(peachWallet, fundingStatus, offer),
  )

  const confirmAndSend = async () => {
    if (!offer?.escrow || !canFundFromPeachWallet) return

    return await peachWallet.sendTo(offer.escrow, offer.amount)
  }

  const fundFromPeachWallet = () => {
    if (!offer?.escrow || !canFundFromPeachWallet) return
    const fee = 110
    const feeRate = 1
    setPopup({
      title: i18n('fundFromPeachWallet.confirm.title'),
      level: 'APP',
      content: (
        <ConfirmFundingFromPeachWallet amount={offer.amount} address={offer.escrow} fee={fee} feeRate={feeRate} />
      ),
      action1: {
        label: i18n('fundFromPeachWallet.confirm.confirmAndSend'),
        icon: 'arrowRightCircle',
        callback: confirmAndSend,
      },
      action2: {
        label: i18n('cancel'),
        icon: 'xCircle',
        callback: closePopup,
      },
    })
  }

  useEffect(() => {
    setCanFundFromPeachWallet(canFundOfferFromPeachWallet(peachWallet, fundingStatus, offer))
  }, [fundingStatus, offer])

  return { canFundFromPeachWallet, fundFromPeachWallet }
}
