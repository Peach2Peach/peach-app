import { useStartRefundPopup } from '../../popups/useStartRefundPopup'
import i18n from '../../utils/i18n'
import { SlideToUnlock } from '../inputs/SlideToUnlock'

type Props = {
  sellOffer?: SellOffer
}

export const RefundEscrowSlider = ({ sellOffer }: Props) => {
  const startRefund = useStartRefundPopup()
  const refundEscrow = () => {
    if (!sellOffer) return
    startRefund(sellOffer)
  }
  return <SlideToUnlock disabled={!sellOffer} onUnlock={refundEscrow} label1={i18n('refundEscrow')} iconId="download" />
}
