import { useStartRefundOverlay } from '../../overlays/useStartRefundOverlay'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SlideToUnlock } from '../inputs/SlideToUnlock'

export const RefundEscrowSlider = ({ sellOffer }: { sellOffer: SellOffer }) => {
  const startRefund = useStartRefundOverlay()
  return (
    <SlideToUnlock
      style={tw`w-[263px]`}
      onUnlock={() => startRefund(sellOffer)}
      label1={i18n('refundEscrow')}
      iconId="download"
    />
  )
}
