import { useCancelAndStartRefundPopup } from '../../popups/useCancelAndStartRefundPopup'
import i18n from '../../utils/i18n'
import { SlideToUnlock } from '../inputs/SlideToUnlock'

export const RefundEscrowSlider = ({ sellOffer }: { sellOffer: SellOffer }) => {
  const cancelAndStartRefundPopup = useCancelAndStartRefundPopup()

  return (
    <SlideToUnlock
      onUnlock={() => cancelAndStartRefundPopup(sellOffer)}
      label1={i18n('refundEscrow')}
      iconId="download"
    />
  )
}
