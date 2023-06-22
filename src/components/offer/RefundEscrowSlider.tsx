import { useStartRefundPopup } from '../../popups/useStartRefundPopup'
import i18n from '../../utils/i18n'
import { ConfirmSlider } from '../confirmSlider/ConfirmSlider'

export const RefundEscrowSlider = ({ sellOffer }: { sellOffer: SellOffer }) => {
  const startRefund = useStartRefundPopup()
  return <ConfirmSlider onUnlock={() => startRefund(sellOffer)} label1={i18n('refundEscrow')} iconId="download" />
}
