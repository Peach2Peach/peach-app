import { useStartRefundPopup } from '../../overlays/useStartRefundPopup'
import i18n from '../../utils/i18n'
import { SlideToUnlock } from '../inputs/SlideToUnlock'

export const RefundEscrowSlider = ({ sellOffer }: { sellOffer: SellOffer }) => {
  const startRefund = useStartRefundPopup()
  return <SlideToUnlock onUnlock={() => startRefund(sellOffer)} label1={i18n('refundEscrow')} iconId="download" />
}
