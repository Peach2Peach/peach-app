import { useCancelAndStartRefundPopup } from '../../popups/useCancelAndStartRefundPopup'
import i18n from '../../utils/i18n'
import { SlideToUnlock } from '../inputs/SlideToUnlock'

type Props = {
  sellOffer?: SellOffer
}

export const RefundEscrowSlider = ({ sellOffer }: Props) => {
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup()
  const refundEscrow = () => {
    if (!sellOffer) return
    cancelAndStartRefundPopup(sellOffer)
  }
  return <SlideToUnlock disabled={!sellOffer} onUnlock={refundEscrow} label1={i18n('refundEscrow')} iconId="download" />
}
